import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createIdMap, remapIds, collectUniqueIds } from './idMapper';

describe('idMapper', () => {
  describe('createIdMap', () => {
    beforeEach(() => {
      // crypto.randomUUID() をモック
      let counter = 0;
      vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return `new-uuid-${counter++}`;
      });
    });

    it('空配列の場合、空のMapを返す', () => {
      const idMap = createIdMap([]);
      expect(idMap.size).toBe(0);
    });

    it('古いIDから新しいIDへのマッピングを作成', () => {
      const oldIds = ['old-id-1', 'old-id-2', 'old-id-3'];
      const idMap = createIdMap(oldIds);

      expect(idMap.size).toBe(3);
      expect(idMap.get('old-id-1')).toBe('new-uuid-0');
      expect(idMap.get('old-id-2')).toBe('new-uuid-1');
      expect(idMap.get('old-id-3')).toBe('new-uuid-2');
    });

    it('重複したIDでも個別にマッピングを作成', () => {
      const oldIds = ['id-1', 'id-1', 'id-2'];
      const idMap = createIdMap(oldIds);

      // 後勝ちで上書きされる
      expect(idMap.size).toBe(2);
      expect(idMap.get('id-1')).toBe('new-uuid-1');
      expect(idMap.get('id-2')).toBe('new-uuid-2');
    });
  });

  describe('remapIds', () => {
    let idMap: Map<string, string>;

    beforeEach(() => {
      idMap = new Map([
        ['old-id-1', 'new-id-1'],
        ['old-id-2', 'new-id-2'],
        ['old-id-3', 'new-id-3'],
      ]);
    });

    it('nullやundefinedはそのまま返す', () => {
      expect(remapIds(null, idMap)).toBe(null);
      expect(remapIds(undefined, idMap)).toBe(undefined);
    });

    it('文字列がIDマップに存在する場合は置換', () => {
      expect(remapIds('old-id-1', idMap)).toBe('new-id-1');
      expect(remapIds('old-id-2', idMap)).toBe('new-id-2');
    });

    it('文字列がIDマップに存在しない場合はそのまま', () => {
      expect(remapIds('unknown-id', idMap)).toBe('unknown-id');
      expect(remapIds('some-text', idMap)).toBe('some-text');
    });

    it('数値や真偽値はそのまま返す', () => {
      expect(remapIds(123, idMap)).toBe(123);
      expect(remapIds(true, idMap)).toBe(true);
      expect(remapIds(false, idMap)).toBe(false);
    });

    it('配列内のIDを再帰的に置換', () => {
      const data = ['old-id-1', 'old-id-2', 'unknown-id'];
      const result = remapIds(data, idMap);

      expect(result).toEqual(['new-id-1', 'new-id-2', 'unknown-id']);
    });

    it('オブジェクトのプロパティ値を再帰的に置換', () => {
      const data = {
        id: 'old-id-1',
        name: 'Test',
        relatedId: 'old-id-2',
        count: 5,
      };
      const result = remapIds(data, idMap);

      expect(result).toEqual({
        id: 'new-id-1',
        name: 'Test',
        relatedId: 'new-id-2',
        count: 5,
      });
    });

    it('ネストしたオブジェクトのIDを再帰的に置換', () => {
      const data = {
        id: 'old-id-1',
        children: [
          { id: 'old-id-2', value: 'A' },
          { id: 'old-id-3', value: 'B' },
        ],
        metadata: {
          createdBy: 'old-id-1',
        },
      };
      const result = remapIds(data, idMap);

      expect(result).toEqual({
        id: 'new-id-1',
        children: [
          { id: 'new-id-2', value: 'A' },
          { id: 'new-id-3', value: 'B' },
        ],
        metadata: {
          createdBy: 'new-id-1',
        },
      });
    });

    it('GraphNodeの構造を置換', () => {
      const node = {
        id: 'old-id-1',
        label: 'Character',
        properties: {
          name: 'Hero',
          scenarioId: 'old-id-2',
        },
      };
      const result = remapIds(node, idMap);

      expect(result).toEqual({
        id: 'new-id-1',
        label: 'Character',
        properties: {
          name: 'Hero',
          scenarioId: 'new-id-2',
        },
      });
    });

    it('GraphRelationshipの構造を置換', () => {
      const relationship = {
        type: 'HAS_SCENE',
        from: 'old-id-1',
        to: 'old-id-2',
        properties: {},
      };
      const result = remapIds(relationship, idMap);

      expect(result).toEqual({
        type: 'HAS_SCENE',
        from: 'new-id-1',
        to: 'new-id-2',
        properties: {},
      });
    });
  });

  describe('collectUniqueIds', () => {
    it('空配列の場合、空配列を返す', () => {
      const result = collectUniqueIds();
      expect(result).toEqual([]);
    });

    it('単一のID配列からユニークなIDを抽出', () => {
      const result = collectUniqueIds(['id-1', 'id-2', 'id-1']);
      expect(result).toEqual(['id-1', 'id-2']);
    });

    it('複数のID配列から重複を除いたIDを抽出', () => {
      const result = collectUniqueIds(
        ['id-1', 'id-2'],
        ['id-2', 'id-3'],
        ['id-1', 'id-4'],
      );
      expect(result.sort()).toEqual(['id-1', 'id-2', 'id-3', 'id-4']);
    });

    it('空配列を含む場合も正しく処理', () => {
      const result = collectUniqueIds(['id-1'], [], ['id-2']);
      expect(result.sort()).toEqual(['id-1', 'id-2']);
    });
  });
});
