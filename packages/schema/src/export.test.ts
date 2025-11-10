import { describe, it, expect } from 'vitest';
import {
  parseExportData,
  parseImportData,
  parseExportMetadata,
  parseGraphDBData,
  parseRDBData,
  type ExportData,
  type GraphNode,
  type GraphRelationship,
} from './export';

describe('export schema', () => {
  describe('parseExportMetadata', () => {
    it('正しいメタデータをパース', () => {
      const data = {
        version: '1.0',
        exportedAt: '2025-11-10T12:00:00.000Z',
        scenarioId: 'scenario-id-1',
        scenarioTitle: 'Test Scenario',
      };

      const result = parseExportMetadata(data);

      expect(result).toEqual(data);
    });

    it('不正なメタデータでエラー', () => {
      const data = {
        version: '1.0',
        // exportedAt が欠けている
        scenarioId: 'scenario-id-1',
        scenarioTitle: 'Test Scenario',
      };

      expect(() => parseExportMetadata(data)).toThrow();
    });
  });

  describe('parseGraphDBData', () => {
    it('正しいGraphDBデータをパース', () => {
      const nodes: GraphNode[] = [
        {
          id: 'node-1',
          label: 'Scenario',
          properties: { title: 'Test' },
        },
        {
          id: 'node-2',
          label: 'Character',
          properties: { name: 'Hero', description: 'A hero' },
        },
      ];

      const relationships: GraphRelationship[] = [
        {
          type: 'APPEARS_IN',
          from: 'node-2',
          to: 'node-1',
          properties: { role: 'protagonist' },
        },
      ];

      const data = { nodes, relationships };
      const result = parseGraphDBData(data);

      expect(result.nodes).toEqual(nodes);
      expect(result.relationships).toEqual(relationships);
    });

    it('空のノード・リレーション配列も許容', () => {
      const data = {
        nodes: [],
        relationships: [],
      };

      const result = parseGraphDBData(data);

      expect(result.nodes).toEqual([]);
      expect(result.relationships).toEqual([]);
    });

    it('不正なノード構造でエラー', () => {
      const data = {
        nodes: [
          {
            id: 'node-1',
            // label が欠けている
            properties: {},
          },
        ],
        relationships: [],
      };

      expect(() => parseGraphDBData(data)).toThrow();
    });
  });

  describe('parseRDBData', () => {
    it('正しいRDBデータをパース', () => {
      const data = {
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
      };

      const result = parseRDBData(data);

      expect(result.scenario).toEqual(data.scenario);
      expect(result.images).toEqual(data.images);
    });

    it('空の画像配列も許容', () => {
      const data = {
        scenario: {
          id: 'scenario-1',
          title: 'Test Scenario',
          createdAt: '2025-11-10T10:00:00.000Z',
          updatedAt: '2025-11-10T12:00:00.000Z',
        },
        images: [],
      };

      const result = parseRDBData(data);

      expect(result.images).toEqual([]);
    });

    it('不正なシナリオ構造でエラー', () => {
      const data = {
        scenario: {
          id: 'scenario-1',
          // title が欠けている
          createdAt: '2025-11-10T10:00:00.000Z',
          updatedAt: '2025-11-10T12:00:00.000Z',
        },
        images: [],
      };

      expect(() => parseRDBData(data)).toThrow();
    });
  });

  describe('parseExportData', () => {
    it('完全なエクスポートデータをパース', () => {
      const data: ExportData = {
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
          ],
          relationships: [],
        },
        rdb: {
          scenario: {
            id: 'scenario-1',
            title: 'Test Scenario',
            createdAt: '2025-11-10T10:00:00.000Z',
            updatedAt: '2025-11-10T12:00:00.000Z',
          },
          images: [],
        },
      };

      const result = parseExportData(data);

      expect(result).toEqual(data);
    });

    it('不正なエクスポートデータでエラー', () => {
      const data = {
        metadata: {
          version: '1.0',
          exportedAt: '2025-11-10T12:00:00.000Z',
          scenarioId: 'scenario-1',
          scenarioTitle: 'Test Scenario',
        },
        // graphdb が欠けている
        rdb: {
          scenario: {
            id: 'scenario-1',
            title: 'Test Scenario',
            createdAt: '2025-11-10T10:00:00.000Z',
            updatedAt: '2025-11-10T12:00:00.000Z',
          },
          images: [],
        },
      };

      expect(() => parseExportData(data)).toThrow();
    });
  });

  describe('parseImportData', () => {
    it('インポートデータ（エクスポートデータと同じ構造）をパース', () => {
      const data: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: '2025-11-10T12:00:00.000Z',
          scenarioId: 'scenario-1',
          scenarioTitle: 'Test Scenario',
        },
        graphdb: {
          nodes: [],
          relationships: [],
        },
        rdb: {
          scenario: {
            id: 'scenario-1',
            title: 'Test Scenario',
            createdAt: '2025-11-10T10:00:00.000Z',
            updatedAt: '2025-11-10T12:00:00.000Z',
          },
          images: [],
        },
      };

      const result = parseImportData(data);

      expect(result).toEqual(data);
    });
  });
});
