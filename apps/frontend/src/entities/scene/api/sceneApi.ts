import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';
import { graphdbWorkerClient } from '../../../workers/graphdbWorkerClient';

/**
 * シーンAPIクラス
 */
export class SceneApi {
  /**
   * シナリオに属するシーンを取得
   */
  static async getScenesByScenarioId(scenarioId: string): Promise<Scene[]> {
    const query = `
      MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene:Scene)
      RETURN scene.id AS id, scene.title AS title, scene.description AS description, scene.isMasterScene AS isMasterScene
    `;
    const result = await graphdbWorkerClient.execute<
      Array<{
        id: string;
        title: string;
        description: string;
        isMasterScene: boolean;
      }>
    >(query);
    return result;
  }

  /**
   * シーン間の接続を取得
   */
  static async getConnectionsByScenarioId(
    scenarioId: string,
  ): Promise<SceneConnection[]> {
    const query = `
      MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene1:Scene)-[r:NEXT_SCENE]->(scene2:Scene)
      RETURN scene1.id AS source, scene2.id AS target, r.order AS order
    `;
    const result = await graphdbWorkerClient.execute<
      Array<{
        source: string;
        target: string;
        order?: number;
      }>
    >(query);
    return result.map((item) => ({
      id: `${item.source}-${item.target}`,
      source: item.source,
      target: item.target,
      order: item.order,
    }));
  }

  /**
   * シーンを作成
   */
  static async createScene(
    scenarioId: string,
    scene: Omit<Scene, 'id'>,
  ): Promise<Scene> {
    const id = crypto.randomUUID();
    const escapedTitle = scene.title.replace(/'/g, "\\'");
    const escapedDescription = scene.description.replace(/'/g, "\\'");

    const query = `
      MATCH (s:Scenario {id: '${scenarioId}'})
      CREATE (scene:Scene {
        id: '${id}',
        title: '${escapedTitle}',
        description: '${escapedDescription}',
        isMasterScene: ${scene.isMasterScene}
      })
      CREATE (s)-[:HAS_SCENE]->(scene)
      RETURN scene.id AS id, scene.title AS title, scene.description AS description, scene.isMasterScene AS isMasterScene
    `;

    const result = await graphdbWorkerClient.execute<
      Array<{
        id: string;
        title: string;
        description: string;
        isMasterScene: boolean;
      }>
    >(query);
    console.log('Scene created:', result);

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to create scene: No result returned from database',
      );
    }

    return result[0];
  }

  /**
   * シーンを更新
   */
  // eslint-disable-next-line complexity
  static async updateScene(
    id: string,
    updates: Partial<Scene>,
  ): Promise<Scene> {
    const setClauses: string[] = [];
    if (updates.title !== undefined) {
      setClauses.push(`scene.title = '${updates.title.replace(/'/g, "\\'")}'`);
    }
    if (updates.description !== undefined) {
      setClauses.push(
        `scene.description = '${updates.description.replace(/'/g, "\\'")}'`,
      );
    }
    if (updates.isMasterScene !== undefined) {
      setClauses.push(`scene.isMasterScene = ${updates.isMasterScene}`);
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      MATCH (scene:Scene {id: '${id}'})
      SET ${setClauses.join(', ')}
      RETURN scene.id AS id, scene.title AS title, scene.description AS description, scene.isMasterScene AS isMasterScene
    `;
    const result = await graphdbWorkerClient.execute<
      Array<{
        id: string;
        title: string;
        description: string;
        isMasterScene: boolean;
      }>
    >(query);

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to update scene: Scene not found or no result returned',
      );
    }

    return result[0];
  }

  /**
   * シーンを削除
   */
  static async deleteScene(id: string): Promise<void> {
    const query = `
      MATCH (scene:Scene {id: '${id}'})
      DETACH DELETE scene
    `;
    await graphdbWorkerClient.execute(query);
  }

  /**
   * シーン間の接続を作成
   */
  static async createConnection(
    connection: Omit<SceneConnection, 'id'>,
  ): Promise<SceneConnection> {
    const orderClause = connection.order ? `{order: ${connection.order}}` : '';
    const query = `
      MATCH (source:Scene {id: '${connection.source}'}), (target:Scene {id: '${connection.target}'})
      CREATE (source)-[r:NEXT_SCENE ${orderClause}]->(target)
      RETURN '${connection.source}-${connection.target}' AS id, '${connection.source}' AS source, '${connection.target}' AS target, r.order AS order
    `;
    const result = await graphdbWorkerClient.execute<
      Array<{
        id: string;
        source: string;
        target: string;
        order?: number;
      }>
    >(query);

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to create connection: No result returned from database',
      );
    }

    return result[0];
  }

  /**
   * シーン間の接続を削除
   */
  static async deleteConnection(id: string): Promise<void> {
    const [source, target] = id.split('-');
    const query = `
      MATCH (source:Scene {id: '${source}'})-[r:NEXT_SCENE]->(target:Scene {id: '${target}'})
      DELETE r
    `;
    await graphdbWorkerClient.execute(query);
  }
}
