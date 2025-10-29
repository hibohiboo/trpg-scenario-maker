import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * 関係性のグラフDB操作リポジトリ
 */
export const relationshipGraphRepository = {
  /**
   * 関係性エッジを作成（A→Bの関係）
   */
  async create(params: {
    id: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) {
    const escapedName = escapeCypherString(params.relationshipName);

    // 1つのクエリでエッジ作成とプロパティ設定を行う
    const result = (await executeQuery(`
      MATCH (from:Character {id: '${params.fromCharacterId}'}), (to:Character {id: '${params.toCharacterId}'})
      CREATE (from)-[r:RELATES_TO {relationshipName: '${escapedName}'}]->(to)
      RETURN '${params.fromCharacterId}' AS fromId, '${params.toCharacterId}' AS toId, '${escapedName}' AS relationshipName
    `)) as {
      fromId: string;
      toId: string;
      relationshipName: string;
    }[];

    const [ret] = result;
    if (!ret) return undefined;

    return {
      id: params.id,
      fromCharacterId: ret.fromId,
      toCharacterId: ret.toId,
      relationshipName: ret.relationshipName,
    };
  },

  /**
   * 関係性エッジを削除
   */
  async delete(params: {
    fromCharacterId: string;
    toCharacterId: string;
  }): Promise<void> {
    await executeQuery(`
      MATCH (from:Character {id: '${params.fromCharacterId}'})-[r:RELATES_TO]->(to:Character {id: '${params.toCharacterId}'})
      DELETE r
    `);
  },

  /**
   * キャラクターの全関係性を取得（発信・受信両方）
   */
  async findByCharacterId(characterId: string) {
    const outgoingResult = (await executeQuery(`
      MATCH (from:Character {id: '${characterId}'})-[r:RELATES_TO]->(to:Character)
      RETURN from, r, to
    `)) as {
      from: { id: string; name: string; description: string };
      r: { relationshipName: string };
      to: { id: string; name: string; description: string };
    }[];

    const incomingResult = (await executeQuery(`
      MATCH (from:Character)-[r:RELATES_TO]->(to:Character {id: '${characterId}'})
      RETURN from, r, to
    `)) as {
      from: { id: string; name: string; description: string };
      r: { relationshipName: string };
      to: { id: string; name: string; description: string };
    }[];

    return {
      outgoing: outgoingResult.map((row) => ({
        fromCharacterId: row.from.id,
        toCharacterId: row.to.id,
        relationshipName: row.r.relationshipName,
      })),
      incoming: incomingResult.map((row) => ({
        fromCharacterId: row.from.id,
        toCharacterId: row.to.id,
        relationshipName: row.r.relationshipName,
      })),
    };
  },

  /**
   * 全関係性を取得
   */
  async findAll() {
    const result = (await executeQuery(`
      MATCH (from:Character)-[r:RELATES_TO]->(to:Character)
      RETURN from, r, to
    `)) as {
      from: { id: string; name: string; description: string };
      r: { relationshipName: string };
      to: { id: string; name: string; description: string };
    }[];

    return result.map((row) => ({
      fromCharacterId: row.from.id,
      toCharacterId: row.to.id,
      relationshipName: row.r.relationshipName,
    }));
  },

  /**
   * 関係性を更新
   */
  async update(params: {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) {
    const escapedName = escapeCypherString(params.relationshipName);

    const result = (await executeQuery(`
      MATCH (from:Character {id: '${params.fromCharacterId}'})-[r:RELATES_TO]->(to:Character {id: '${params.toCharacterId}'})
      SET r.relationshipName = '${escapedName}'
      RETURN from, r, to
    `)) as {
      from: { id: string; name: string; description: string };
      r: { relationshipName: string };
      to: { id: string; name: string; description: string };
    }[];

    const [ret] = result;
    if (!ret) return undefined;

    return {
      fromCharacterId: ret.from.id,
      toCharacterId: ret.to.id,
      relationshipName: ret.r.relationshipName,
    };
  },
} as const;
