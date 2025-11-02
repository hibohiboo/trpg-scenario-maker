import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * 関係性のグラフDB操作リポジトリ
 */
export const characterRelationshipGraphRepository = {
  /**
   * 関係性エッジを作成（A→Bの関係）
   * idを明示的に指定することで、同じキャラクターペア間に複数の関係性を持てる
   */
  async create(params: {
    id: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) {
    const escapedName = escapeCypherString(params.relationshipName);

    return executeQuery(`
      MATCH (f:Character {id: '${params.fromCharacterId}'})
          , (t:Character {id: '${params.toCharacterId}'})
      CREATE (f)-[:CHARACTER_RELATES_TO {id: '${params.id}', relationshipName: '${escapedName}'}]->(t)
      RETURN '${params.id}' AS id, '${params.fromCharacterId}' AS fromCharacterId, '${params.toCharacterId}' AS toCharacterId, '${escapedName}' AS relationshipName
    `);
  },

  /**
   * 関係性エッジを削除（idで特定）
   */
  async delete(params: {
    id: string;
  }): Promise<void> {
    await executeQuery(`
      MATCH ()-[r:CHARACTER_RELATES_TO {id: '${params.id}'}]->()
      DELETE r
    `);
  },

  /**
   * キャラクターの全関係性を取得（発信・受信両方）
   */
  async findByCharacterId(characterId: string) {
    const outgoingResult = (await executeQuery(`
      MATCH (f:Character {id: '${characterId}'})-[r:CHARACTER_RELATES_TO]->(t:Character)
      RETURN f, r, t
    `)) as {
      f: { id: string; name: string; description: string };
      r: { id: string; relationshipName: string };
      t: { id: string; name: string; description: string };
    }[];

    const incomingResult = (await executeQuery(`
      MATCH (f:Character)-[r:CHARACTER_RELATES_TO]->(t:Character {id: '${characterId}'})
      RETURN f, r, t
    `)) as {
      f: { id: string; name: string; description: string };
      r: { id: string; relationshipName: string };
      t: { id: string; name: string; description: string };
    }[];
    return {
      outgoing: outgoingResult.map((row) => ({
        id: row.r.id,
        fromCharacterId: row.f.id,
        toCharacterId: row.t.id,
        relationshipName: row.r.relationshipName,
      })),
      incoming: incomingResult.map((row) => ({
        id: row.r.id,
        fromCharacterId: row.f.id,
        toCharacterId: row.t.id,
        relationshipName: row.r.relationshipName,
      })),
    };
  },

  /**
   * 全関係性を取得
   */
  async findAll() {
    const result = (await executeQuery(`
      MATCH (f:Character)-[r:CHARACTER_RELATES_TO]->(t:Character)
      RETURN f, r, t
    `)) as {
      f: { id: string; name: string; description: string };
      r: { id: string; relationshipName: string };
      t: { id: string; name: string; description: string };
    }[];

    return result.map((row) => ({
      id: row.r.id,
      fromCharacterId: row.f.id,
      toCharacterId: row.t.id,
      relationshipName: row.r.relationshipName,
    }));
  },

  /**
   * 関係性を更新（idで特定）
   */
  async update(params: {
    id: string;
    relationshipName: string;
  }) {
    const escapedName = escapeCypherString(params.relationshipName);

    return executeQuery(`
      MATCH (f:Character)-[r:CHARACTER_RELATES_TO {id: '${params.id}'}]->(t:Character)
      SET r.relationshipName = '${escapedName}'
      RETURN r.id AS id, f.id AS fromCharacterId, t.id AS toCharacterId, '${escapedName}' AS relationshipName
    `);
  },
} as const;
