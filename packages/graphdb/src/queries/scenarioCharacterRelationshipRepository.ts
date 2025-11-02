import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * シナリオ内キャラクター関係性のグラフDB操作リポジトリ
 */
export const scenarioCharacterRelationshipRepository = {
  /**
   * シナリオ内の関係性エッジを作成（A→Bのシナリオ固有の関係）
   */
  async create(params: {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) {
    const escapedName = escapeCypherString(params.relationshipName);

    return executeQuery(`
      MATCH (f:Character {id: '${params.fromCharacterId}'})
          , (t:Character {id: '${params.toCharacterId}'})
      CREATE (f)-[r:RELATES_IN_SCENARIO {scenarioId: '${params.scenarioId}', relationshipName: '${escapedName}'}]->(t)
      RETURN '${params.scenarioId}' AS scenarioId, '${params.fromCharacterId}' AS fromCharacterId, '${params.toCharacterId}' AS toCharacterId, '${escapedName}' AS relationshipName
    `);
  },

  /**
   * シナリオ内の関係性を更新
   */
  async update(params: {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) {
    const escapedName = escapeCypherString(params.relationshipName);

    return executeQuery(`
      MATCH (f:Character {id: '${params.fromCharacterId}'})-[r:RELATES_IN_SCENARIO {scenarioId: '${params.scenarioId}'}]->(t:Character {id: '${params.toCharacterId}'})
      SET r.relationshipName = '${escapedName}'
      RETURN '${params.scenarioId}' AS scenarioId, f.id AS fromCharacterId, t.id AS toCharacterId, '${escapedName}' AS relationshipName
    `);
  },

  /**
   * シナリオ内の関係性を削除
   */
  async delete(params: {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
  }): Promise<void> {
    await executeQuery(`
      MATCH (f:Character {id: '${params.fromCharacterId}'})-[r:RELATES_IN_SCENARIO {scenarioId: '${params.scenarioId}'}]->(t:Character {id: '${params.toCharacterId}'})
      DELETE r
    `);
  },

  /**
   * シナリオ内の全関係性を取得
   */
  async findByScenarioId(scenarioId: string) {
    const result = (await executeQuery(`
      MATCH (f:Character)-[r:RELATES_IN_SCENARIO {scenarioId: '${scenarioId}'}]->(t:Character)
      RETURN f, r, t
    `)) as {
      f: { id: string; name: string; description: string };
      r: { scenarioId: string; relationshipName: string };
      t: { id: string; name: string; description: string };
    }[];

    return result.map((row) => ({
      scenarioId: row.r.scenarioId,
      fromCharacterId: row.f.id,
      toCharacterId: row.t.id,
      relationshipName: row.r.relationshipName,
    }));
  },

  /**
   * シナリオ内の特定キャラクターに関する関係性を取得（発信・受信両方）
   */
  async findByScenarioAndCharacterId(params: {
    scenarioId: string;
    characterId: string;
  }) {
    const outgoingResult = (await executeQuery(`
      MATCH (f:Character {id: '${params.characterId}'})-[r:RELATES_IN_SCENARIO {scenarioId: '${params.scenarioId}'}]->(t:Character)
      RETURN f, r, t
    `)) as {
      f: { id: string; name: string; description: string };
      r: { scenarioId: string; relationshipName: string };
      t: { id: string; name: string; description: string };
    }[];

    const incomingResult = (await executeQuery(`
      MATCH (f:Character)-[r:RELATES_IN_SCENARIO {scenarioId: '${params.scenarioId}'}]->(t:Character {id: '${params.characterId}'})
      RETURN f, r, t
    `)) as {
      f: { id: string; name: string; description: string };
      r: { scenarioId: string; relationshipName: string };
      t: { id: string; name: string; description: string };
    }[];

    return {
      outgoing: outgoingResult.map((row) => ({
        scenarioId: row.r.scenarioId,
        fromCharacterId: row.f.id,
        toCharacterId: row.t.id,
        relationshipName: row.r.relationshipName,
      })),
      incoming: incomingResult.map((row) => ({
        scenarioId: row.r.scenarioId,
        fromCharacterId: row.f.id,
        toCharacterId: row.t.id,
        relationshipName: row.r.relationshipName,
      })),
    };
  },
} as const;
