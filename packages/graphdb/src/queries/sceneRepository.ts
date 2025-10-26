import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

const RELATION_DELIMITER = '|';

const relationIdToIds = (id: string) => id.split(RELATION_DELIMITER);

/**
 * シーンのグラフDB操作リポジトリ
 */
export const sceneGraphRepository = {
  /**
   * シナリオに属するシーンを取得
   */
  async getScenesByScenarioId(scenarioId: string) {
    return executeQuery(`
      MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene:Scene)
      RETURN scene.id AS id, scene.title AS title, scene.description AS description, scene.isMasterScene AS isMasterScene
    `);
  },

  /**
   * シーン間の接続を取得
   */
  async getConnectionsByScenarioId(scenarioId: string) {
    return executeQuery(`
      MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene1:Scene)-[r:NEXT_SCENE]->(scene2:Scene)
      RETURN scene1.id + '${RELATION_DELIMITER}' + scene2.id AS id, scene1.id AS source, scene2.id AS target
    `);
  },

  /**
   * シーンを作成
   */
  async createScene(params: {
    scenarioId: string;
    id: string;
    title: string;
    description: string;
    isMasterScene: boolean;
  }) {
    const escapedTitle = escapeCypherString(params.title);
    const escapedDescription = escapeCypherString(params.description);

    return executeQuery(`
      MATCH (s:Scenario {id: '${params.scenarioId}'})
      CREATE (scene:Scene {
        id: '${params.id}',
        title: '${escapedTitle}',
        description: '${escapedDescription}',
        isMasterScene: ${params.isMasterScene}
      })
      CREATE (s)-[:HAS_SCENE]->(scene)
      RETURN scene.id AS id, scene.title AS title, scene.description AS description, scene.isMasterScene AS isMasterScene
    `);
  },

  /**
   * シーンを更新
   */
  async updateScene(params: {
    id: string;
    title?: string;
    description?: string;
    isMasterScene?: boolean;
  }) {
    const setClauses: string[] = [];
    if (params.title !== undefined) {
      setClauses.push(`scene.title = '${escapeCypherString(params.title)}'`);
    }
    if (params.description !== undefined) {
      setClauses.push(
        `scene.description = '${escapeCypherString(params.description)}'`,
      );
    }
    if (params.isMasterScene !== undefined) {
      setClauses.push(`scene.isMasterScene = ${params.isMasterScene}`);
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    return executeQuery(`
      MATCH (scene:Scene {id: '${params.id}'})
      SET ${setClauses.join(', ')}
      RETURN scene.id AS id, scene.title AS title, scene.description AS description, scene.isMasterScene AS isMasterScene
    `);
  },

  /**
   * シーンを削除
   */
  async deleteScene(id: string) {
    return executeQuery(`
      MATCH (scene:Scene {id: '${id}'})
      DETACH DELETE scene
    `);
  },

  /**
   * シーン間の接続を作成
   */
  async createConnection(params: { source: string; target: string }) {
    return executeQuery(`
      MATCH (source:Scene {id: '${params.source}'}), (target:Scene {id: '${params.target}'})
      CREATE (source)-[r:NEXT_SCENE]->(target)
      RETURN '${params.source}${RELATION_DELIMITER}${params.target}' AS id, '${params.source}' AS source, '${params.target}' AS target
    `);
  },

  /**
   * シーン間の接続を削除
   */
  async deleteConnection(id: string) {
    const [source, target] = relationIdToIds(id);
    return executeQuery(`
      MATCH (source:Scene {id: '${source}'})-[r:NEXT_SCENE]->(target:Scene {id: '${target}'})
      DELETE r
    `);
  },
} as const;
