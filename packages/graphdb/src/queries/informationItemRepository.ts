import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * 情報項目のグラフDB操作リポジトリ
 */
export const informationItemRepository = {
  /**
   * シナリオに属する情報項目を取得
   */
  async getInformationItemsByScenarioId(scenarioId: string) {
    return executeQuery(`
      MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_INFORMATION]->(item:InformationItem)
      RETURN item.id AS id, item.title AS title, item.description AS description, item.scenarioId AS scenarioId
    `);
  },

  /**
   * 情報項目を作成
   */
  async createInformationItem(params: {
    scenarioId: string;
    id: string;
    title: string;
    description: string;
  }) {
    const escapedTitle = escapeCypherString(params.title);
    const escapedDescription = escapeCypherString(params.description);

    return executeQuery(`
      MATCH (s:Scenario {id: '${params.scenarioId}'})
      CREATE (item:InformationItem {
        id: '${params.id}',
        title: '${escapedTitle}',
        description: '${escapedDescription}',
        scenarioId: '${params.scenarioId}'
      })
      CREATE (s)-[:HAS_INFORMATION]->(item)
      RETURN item.id AS id, item.title AS title, item.description AS description, item.scenarioId AS scenarioId
    `);
  },

  /**
   * 情報項目を更新
   */
  async updateInformationItem(params: {
    id: string;
    title?: string;
    description?: string;
  }) {
    const setClauses: string[] = [];
    if (params.title !== undefined) {
      setClauses.push(`item.title = '${escapeCypherString(params.title)}'`);
    }
    if (params.description !== undefined) {
      setClauses.push(`item.description = '${escapeCypherString(params.description)}'`);
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    return executeQuery(`
      MATCH (item:InformationItem {id: '${params.id}'})
      SET ${setClauses.join(', ')}
      RETURN item.id AS id, item.title AS title, item.description AS description, item.scenarioId AS scenarioId
    `);
  },

  /**
   * 情報項目を削除
   */
  async deleteInformationItem(id: string) {
    return executeQuery(`
      MATCH (item:InformationItem {id: '${id}'})
      DETACH DELETE item
    `);
  },

  /**
   * 情報項目同士の関連を取得
   */
  async getInformationConnectionsByScenarioId(scenarioId: string) {
    return executeQuery(`
      MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_INFORMATION]->(item1:InformationItem)-[r:INFORMATION_RELATED_TO]->(item2:InformationItem)
      RETURN r.id AS id, item1.id AS source, item2.id AS target
    `);
  },

  /**
   * 情報項目同士の関連を作成
   */
  async createInformationConnection(params: { id: string; source: string; target: string }) {
    return executeQuery(`
      MATCH (source:InformationItem {id: '${params.source}'}), (target:InformationItem {id: '${params.target}'})
      CREATE (source)-[r:INFORMATION_RELATED_TO {id: '${params.id}'}]->(target)
      RETURN r.id AS id, '${params.source}' AS source, '${params.target}' AS target
    `);
  },

  /**
   * 情報項目同士の関連を削除
   */
  async deleteInformationConnection(id: string) {
    return executeQuery(`
      MATCH ()-[r:INFORMATION_RELATED_TO {id: '${id}'}]->()
      DELETE r
    `);
  },

  /**
   * シーン→情報項目の関連を取得
   */
  async getSceneInformationConnectionsBySceneId(sceneId: string) {
    return executeQuery(`
      MATCH (scene:Scene {id: '${sceneId}'})-[r:SCENE_HAS_INFO]->(item:InformationItem)
      RETURN r.id AS id, '${sceneId}' AS sceneId, item.id AS informationItemId
    `);
  },

  /**
   * シーン→情報項目の関連を作成
   */
  async createSceneInformationConnection(params: { id: string; sceneId: string; informationItemId: string }) {
    return executeQuery(`
      MATCH (scene:Scene {id: '${params.sceneId}'}), (item:InformationItem {id: '${params.informationItemId}'})
      CREATE (scene)-[r:SCENE_HAS_INFO {id: '${params.id}'}]->(item)
      RETURN r.id AS id, '${params.sceneId}' AS sceneId, '${params.informationItemId}' AS informationItemId
    `);
  },

  /**
   * シーン→情報項目の関連を削除
   */
  async deleteSceneInformationConnection(id: string) {
    return executeQuery(`
      MATCH ()-[r:SCENE_HAS_INFO {id: '${id}'}]->()
      DELETE r
    `);
  },

  /**
   * 情報項目→シーンの関連を取得
   */
  async getInformationToSceneConnectionsByInformationItemId(informationItemId: string) {
    return executeQuery(`
      MATCH (item:InformationItem {id: '${informationItemId}'})-[r:INFO_POINTS_TO_SCENE]->(scene:Scene)
      RETURN r.id AS id, '${informationItemId}' AS informationItemId, scene.id AS sceneId
    `);
  },

  /**
   * 情報項目→シーンの関連を作成
   */
  async createInformationToSceneConnection(params: { id: string; informationItemId: string; sceneId: string }) {
    return executeQuery(`
      MATCH (item:InformationItem {id: '${params.informationItemId}'}), (scene:Scene {id: '${params.sceneId}'})
      CREATE (item)-[r:INFO_POINTS_TO_SCENE {id: '${params.id}'}]->(scene)
      RETURN r.id AS id, '${params.informationItemId}' AS informationItemId, '${params.sceneId}' AS sceneId
    `);
  },

  /**
   * 情報項目→シーンの関連を削除
   */
  async deleteInformationToSceneConnection(id: string) {
    return executeQuery(`
      MATCH ()-[r:INFO_POINTS_TO_SCENE {id: '${id}'}]->()
      DELETE r
    `);
  },
} as const;
