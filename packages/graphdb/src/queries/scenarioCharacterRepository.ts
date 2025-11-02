import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * シナリオ×キャラクター関係のグラフDB操作リポジトリ
 */
export const scenarioCharacterRepository = {
  /**
   * キャラクターをシナリオに追加（APPEARS_INエッジを作成）
   */
  async addCharacterToScenario(params: {
    scenarioId: string;
    characterId: string;
    role?: string;
  }) {
    const escapedRole = escapeCypherString(params.role || '');

    return executeQuery(`
      MATCH (c:Character {id: '${params.characterId}'}), (s:Scenario {id: '${params.scenarioId}'})
      CREATE (c)-[r:APPEARS_IN {role: '${escapedRole}'}]->(s)
      RETURN '${params.scenarioId}' AS scenarioId, '${params.characterId}' AS characterId, r.role AS role
    `);
  },

  /**
   * シナリオからキャラクターを削除（APPEARS_INエッジを削除）
   */
  async removeCharacterFromScenario(params: {
    scenarioId: string;
    characterId: string;
  }) {
    return executeQuery(`
      MATCH (c:Character {id: '${params.characterId}'})-[r:APPEARS_IN]->(s:Scenario {id: '${params.scenarioId}'})
      DELETE r
    `);
  },

  /**
   * シナリオ内でのキャラクターの役割を更新
   */
  async updateCharacterRole(params: {
    scenarioId: string;
    characterId: string;
    role: string;
  }) {
    const escapedRole = escapeCypherString(params.role);

    return executeQuery(`
      MATCH (c:Character {id: '${params.characterId}'})-[r:APPEARS_IN]->(s:Scenario {id: '${params.scenarioId}'})
      SET r.role = '${escapedRole}'
      RETURN '${params.scenarioId}' AS scenarioId, '${params.characterId}' AS characterId, r.role AS role
    `);
  },

  /**
   * シナリオに登場するキャラクター一覧を取得
   */
  async findCharactersByScenarioId(scenarioId: string) {
    return executeQuery(`
      MATCH (c:Character)-[r:APPEARS_IN]->(s:Scenario {id: '${scenarioId}'})
      RETURN '${scenarioId}' AS scenarioId, c.id AS characterId, r.role AS role
    `);
  },
} as const;
