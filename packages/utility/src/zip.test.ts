import { describe, it, expect } from 'vitest';
import { exportToZip, importFromZip } from './zip';
import type { ExportData } from '@trpg-scenario-maker/schema';

describe('zip utilities', () => {
  const sampleExportData: ExportData = {
    metadata: {
      version: '1.0',
      exportedAt: '2025-11-10T12:00:00.000Z',
      scenarioId: 'scenario-1',
      scenarioTitle: 'Test Scenario',
    },
    graphdb: {
      nodes: [
        {
          id: 'scenario-1',
          label: 'Scenario',
          properties: { title: 'Test' },
        },
        {
          id: 'character-1',
          label: 'Character',
          properties: { name: 'Hero', description: 'A brave hero' },
        },
      ],
      relationships: [
        {
          type: 'APPEARS_IN',
          from: 'character-1',
          to: 'scenario-1',
          properties: { role: 'protagonist' },
        },
      ],
    },
    rdb: {
      scenario: {
        id: 'scenario-1',
        title: 'Test Scenario',
        createdAt: '2025-11-10T10:00:00.000Z',
        updatedAt: '2025-11-10T12:00:00.000Z',
      },
      images: [
        {
          id: 'image-1',
          dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
          createdAt: '2025-11-10T11:00:00.000Z',
        },
      ],
    },
  };

  describe('exportToZip', () => {
    it('ExportDataをZIP Blobに変換', async () => {
      const zipBlob = await exportToZip(sampleExportData);

      expect(zipBlob).toBeInstanceOf(Blob);
      expect(zipBlob.type).toBe('application/zip');
      expect(zipBlob.size).toBeGreaterThan(0);
    });

    it('空のデータでもZIPを生成', async () => {
      const emptyData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: '2025-11-10T12:00:00.000Z',
          scenarioId: 'empty-scenario',
          scenarioTitle: 'Empty',
        },
        graphdb: {
          nodes: [],
          relationships: [],
        },
        rdb: {
          scenario: {
            id: 'empty-scenario',
            title: 'Empty',
            createdAt: '2025-11-10T10:00:00.000Z',
            updatedAt: '2025-11-10T10:00:00.000Z',
          },
          images: [],
        },
      };

      const zipBlob = await exportToZip(emptyData);

      expect(zipBlob).toBeInstanceOf(Blob);
      expect(zipBlob.size).toBeGreaterThan(0);
    });
  });

  describe('importFromZip', () => {
    it('ZIP BlobからExportDataを復元', async () => {
      // まずエクスポート
      const zipBlob = await exportToZip(sampleExportData);

      // インポート
      const importedData = await importFromZip(zipBlob);

      // データが正しく復元されるか検証
      expect(importedData.metadata).toEqual(sampleExportData.metadata);
      expect(importedData.graphdb.nodes).toEqual(sampleExportData.graphdb.nodes);
      expect(importedData.graphdb.relationships).toEqual(
        sampleExportData.graphdb.relationships,
      );
      expect(importedData.rdb.scenario).toEqual(sampleExportData.rdb.scenario);
      expect(importedData.rdb.images).toEqual(sampleExportData.rdb.images);
    });

    it('エクスポート→インポートの往復でデータが保持される', async () => {
      const zipBlob = await exportToZip(sampleExportData);
      const importedData = await importFromZip(zipBlob);

      // 完全一致を検証
      expect(importedData).toEqual(sampleExportData);
    });

    it('不正なZIPファイルでエラー', async () => {
      const invalidZip = new Blob(['invalid content'], {
        type: 'application/zip',
      });

      await expect(importFromZip(invalidZip)).rejects.toThrow();
    });

    it('必要なファイルが欠けている場合はエラー', async () => {
      // metadata.jsonのみを含む不完全なZIPを作成
      const { BlobWriter, BlobReader, ZipWriter } = await import(
        '@zip.js/zip.js'
      );
      const blobWriter = new BlobWriter('application/zip');
      const zipWriter = new ZipWriter(blobWriter);

      await zipWriter.add(
        'metadata.json',
        new BlobReader(
          new Blob([JSON.stringify(sampleExportData.metadata)], {
            type: 'application/json',
          }),
        ),
      );

      const incompleteZip = await zipWriter.close();

      await expect(importFromZip(incompleteZip)).rejects.toThrow(
        'Invalid ZIP structure: missing required files',
      );
    });
  });

  describe('エクスポート・インポートの統合テスト', () => {
    it('複数のノード・リレーションを含むデータの往復', async () => {
      const complexData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: '2025-11-10T12:00:00.000Z',
          scenarioId: 'complex-scenario',
          scenarioTitle: 'Complex Scenario',
        },
        graphdb: {
          nodes: [
            { id: 's1', label: 'Scenario', properties: { title: 'Main' } },
            { id: 'c1', label: 'Character', properties: { name: 'Hero' } },
            { id: 'c2', label: 'Character', properties: { name: 'Villain' } },
            { id: 'sc1', label: 'Scene', properties: { title: 'Opening' } },
            { id: 'sc2', label: 'Scene', properties: { title: 'Finale' } },
          ],
          relationships: [
            { type: 'APPEARS_IN', from: 'c1', to: 's1', properties: {} },
            { type: 'APPEARS_IN', from: 'c2', to: 's1', properties: {} },
            { type: 'HAS_SCENE', from: 's1', to: 'sc1', properties: {} },
            { type: 'HAS_SCENE', from: 's1', to: 'sc2', properties: {} },
            { type: 'NEXT_SCENE', from: 'sc1', to: 'sc2', properties: {} },
          ],
        },
        rdb: {
          scenario: {
            id: 'complex-scenario',
            title: 'Complex Scenario',
            createdAt: '2025-11-10T10:00:00.000Z',
            updatedAt: '2025-11-10T12:00:00.000Z',
          },
          images: [
            {
              id: 'img1',
              dataUrl: 'data:image/png;base64,ABC...',
              createdAt: '2025-11-10T11:00:00.000Z',
            },
            {
              id: 'img2',
              dataUrl: 'data:image/jpeg;base64,XYZ...',
              createdAt: '2025-11-10T11:30:00.000Z',
            },
          ],
        },
      };

      const zipBlob = await exportToZip(complexData);
      const importedData = await importFromZip(zipBlob);

      expect(importedData).toEqual(complexData);
      expect(importedData.graphdb.nodes.length).toBe(5);
      expect(importedData.graphdb.relationships.length).toBe(5);
      expect(importedData.rdb.images.length).toBe(2);
    });
  });
});
