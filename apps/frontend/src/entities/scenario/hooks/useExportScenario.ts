import { BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  exportScenarioAction,
  getScenarioImageIdsAction,
} from '../actions/scenarioExportActions';
import type { Scenario } from '@trpg-scenario-maker/schema';

/**
 * シナリオエクスポート機能のフック
 */
export const useExportScenario = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isExporting, setIsExporting] = useState(false);

  const exportScenario = useCallback(
    async (scenario: Scenario) => {
      try {
        setIsExporting(true);

        // シナリオに関連する画像IDを取得
        const imageIds = await dispatch(
          getScenarioImageIdsAction({
            scenarioId: scenario.id,
          }),
        ).unwrap();

        // 完全なシナリオデータ（GraphDB + RDB）をエクスポート
        const fullResult = await dispatch(
          exportScenarioAction({
            scenarioId: scenario.id,
            imageIds,
          }),
        ).unwrap();

        // ZIPファイルを作成
        const zipWriter = new ZipWriter(new BlobWriter('application/zip'));

        // scenario.json を追加
        const exportData = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          scenario: {
            id: scenario.id,
            title: scenario.title,
          },
          graphData: fullResult.graphData,
          rdbData: {
            scenario: fullResult.rdbData.scenario,
            // 画像データは別ファイルとして保存するため除外
            images: fullResult.rdbData.images.map((img) => ({
              id: img.id,
              createdAt: img.createdAt,
            })),
          },
        };

        await zipWriter.add(
          'scenario.json',
          new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
          }).stream(),
        );

        // 画像ファイルを追加
        await Promise.all(
          fullResult.rdbData.images.map(async (image) => {
            // data URL から拡張子を取得
            const match = image.dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
            if (match) {
              const [, ext, base64Data] = match;
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              Array.from({ length: binaryString.length }).forEach((_, i) => {
                bytes[i] = binaryString.charCodeAt(i);
              });
              await zipWriter.add(
                `images/${image.id}.${ext}`,
                new Blob([bytes], { type: `image/${ext}` }).stream(),
              );
            }
          }),
        );

        // ZIPファイルをダウンロード
        const zipBlob = await zipWriter.close();
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${scenario.title}_${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to export scenario:', error);
        throw error;
      } finally {
        setIsExporting(false);
      }
    },
    [dispatch],
  );

  return {
    exportScenario,
    isExporting,
  };
};
