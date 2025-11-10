import {
  BlobReader,
  ZipReader,
  TextWriter,
  type FileEntry,
  type Entry,
  type DirectoryEntry,
} from '@zip.js/zip.js';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { importScenarioAction } from '../actions/scenarioExportActions';
import type { GraphDBData, RDBData } from '@trpg-scenario-maker/schema';

const typeGuard = (x: Entry & { getData?: unknown }): x is DirectoryEntry =>
  x.getData == null;

/**
 * シナリオインポート機能のフック
 */
export const useImportScenario = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isImporting, setIsImporting] = useState(false);

  const importScenario = useCallback(
    async (file: File) => {
      try {
        setIsImporting(true);

        // ZIPファイルを読み込み
        const zipReader = new ZipReader(new BlobReader(file));
        const entries = await zipReader.getEntries();

        // scenario.json を読み込み
        const scenarioEntry = entries.find(
          (entry): entry is FileEntry => entry.filename === 'scenario.json',
        );
        if (!scenarioEntry || !scenarioEntry.getData) {
          throw new Error('scenario.json not found in ZIP file');
        }

        const scenarioJsonText = await scenarioEntry.getData(new TextWriter());
        const scenarioData = JSON.parse(scenarioJsonText) as {
          version: string;
          exportedAt: string;
          scenario: { id: string; title: string };
          graphData: GraphDBData;
          rdbData: {
            scenario: RDBData['scenario'];
            images: Array<{ id: string; createdAt: string }>;
          };
        };

        // 画像ファイルを読み込んでData URLに変換
        const imageEntries = entries.filter((entry) =>
          entry.filename.startsWith('images/'),
        );
        const images = await Promise.all(
          imageEntries.map(async (entry) => {
            if (typeGuard(entry)) {
              return null;
            }

            // ファイル名から画像IDと拡張子を取得
            const match = entry.filename.match(/^images\/(.+)\.(\w+)$/);
            if (!match) {
              return null;
            }

            const [, imageId, ext] = match;
            const imageMetadata = scenarioData.rdbData.images.find(
              (img) => img.id === imageId,
            );
            if (!imageMetadata) {
              return null;
            }

            // 画像データをBlobとして取得

            const blob = await entry.getData<Blob>(
              new TransformStream().writable,
            );
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Base64エンコード
            let binary = '';
            Array.from(uint8Array).forEach((byte) => {
              binary += String.fromCharCode(byte);
            });
            const base64 = btoa(binary);

            // Data URL形式に変換
            return {
              id: imageId,
              dataUrl: `data:image/${ext};base64,${base64}`,
              createdAt: imageMetadata.createdAt,
            };
          }),
        );

        // nullを除外
        const validImages = images.filter(
          (img): img is NonNullable<typeof img> => img !== null,
        );

        await zipReader.close();

        // インポート実行
        await dispatch(
          importScenarioAction({
            graphData: scenarioData.graphData,
            rdbData: {
              scenario: scenarioData.rdbData.scenario,
              images: validImages,
            },
          }),
        ).unwrap();

        return {
          scenarioId: scenarioData.scenario.id,
          title: scenarioData.scenario.title,
        };
      } catch (error) {
        console.error('Failed to import scenario:', error);
        throw error;
      } finally {
        setIsImporting(false);
      }
    },
    [dispatch],
  );

  return {
    importScenario,
    isImporting,
  };
};
