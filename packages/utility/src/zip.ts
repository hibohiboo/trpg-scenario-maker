import { BlobWriter, BlobReader, ZipWriter, ZipReader } from '@zip.js/zip.js';
import type { ExportData } from '@trpg-scenario-maker/schema';

/**
 * エクスポートデータをZIP形式に圧縮
 *
 * @param data - エクスポートデータ
 * @returns ZIP Blob
 */
export async function exportToZip(data: ExportData): Promise<Blob> {
  const blobWriter = new BlobWriter('application/zip');
  const zipWriter = new ZipWriter(blobWriter);

  try {
    // metadata.json
    await zipWriter.add(
      'metadata.json',
      new BlobReader(
        new Blob([JSON.stringify(data.metadata, null, 2)], {
          type: 'application/json',
        }),
      ),
    );

    // graphdb/nodes.json
    await zipWriter.add(
      'graphdb/nodes.json',
      new BlobReader(
        new Blob([JSON.stringify(data.graphdb.nodes, null, 2)], {
          type: 'application/json',
        }),
      ),
    );

    // graphdb/relationships.json
    await zipWriter.add(
      'graphdb/relationships.json',
      new BlobReader(
        new Blob([JSON.stringify(data.graphdb.relationships, null, 2)], {
          type: 'application/json',
        }),
      ),
    );

    // rdb/scenario.json
    await zipWriter.add(
      'rdb/scenario.json',
      new BlobReader(
        new Blob([JSON.stringify(data.rdb.scenario, null, 2)], {
          type: 'application/json',
        }),
      ),
    );

    // rdb/images.json
    await zipWriter.add(
      'rdb/images.json',
      new BlobReader(
        new Blob([JSON.stringify(data.rdb.images, null, 2)], {
          type: 'application/json',
        }),
      ),
    );

    const zipBlob = await zipWriter.close();
    return zipBlob;
  } catch (error) {
    // エラー時はクリーンアップ
    await zipWriter.close();
    throw error;
  }
}

/**
 * ZIP Blobからエクスポートデータをインポート
 *
 * @param zipBlob - ZIP Blob
 * @returns エクスポートデータ
 */
export async function importFromZip(zipBlob: Blob): Promise<ExportData> {
  const zipReader = new ZipReader(new BlobReader(zipBlob));

  try {
    const entries = await zipReader.getEntries();

    // 各ファイルを読み込む
    const fileMap = new Map<string, unknown>();

    for (const entry of entries) {
      // ディレクトリエントリをスキップ
      if (entry.directory || !entry.getData) {
        continue;
      }

      const blobWriter = new BlobWriter('application/json');
      const blob = await entry.getData(blobWriter);
      const text = await blob.text();
      const data = JSON.parse(text);

      fileMap.set(entry.filename, data);
    }

    await zipReader.close();

    // ExportData構造に組み立て
    const metadata = fileMap.get('metadata.json');
    const nodes = fileMap.get('graphdb/nodes.json');
    const relationships = fileMap.get('graphdb/relationships.json');
    const scenario = fileMap.get('rdb/scenario.json');
    const images = fileMap.get('rdb/images.json');

    if (!metadata || !nodes || !relationships || !scenario || !images) {
      throw new Error('Invalid ZIP structure: missing required files');
    }

    const exportData: ExportData = {
      metadata: metadata as ExportData['metadata'],
      graphdb: {
        nodes: nodes as ExportData['graphdb']['nodes'],
        relationships: relationships as ExportData['graphdb']['relationships'],
      },
      rdb: {
        scenario: scenario as ExportData['rdb']['scenario'],
        images: images as ExportData['rdb']['images'],
      },
    };

    return exportData;
  } catch (error) {
    await zipReader.close();
    throw error;
  }
}
