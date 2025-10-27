import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * シーンイベントのグラフDB操作リポジトリ
 */
export const sceneEventRepository = {
  /**
   * シーンに属するイベントを取得
   */
  async getEventsBySceneId(sceneId: string) {
    return executeQuery(`
      MATCH (scene:Scene {id: '${sceneId}'})-[:HAS_EVENT]->(event:SceneEvent)
      RETURN event.id AS id, event.type AS type, event.content AS content, event.sortOrder AS sortOrder
      ORDER BY event.sortOrder ASC
    `);
  },

  /**
   * イベントを作成
   */
  async createEvent(params: {
    sceneId: string;
    id: string;
    type: string;
    content: string;
    sortOrder: number;
  }) {
    const escapedContent = escapeCypherString(params.content);

    return executeQuery(`
      MATCH (scene:Scene {id: '${params.sceneId}'})
      CREATE (event:SceneEvent {
        id: '${params.id}',
        type: '${params.type}',
        content: '${escapedContent}',
        sortOrder: ${params.sortOrder}
      })
      CREATE (scene)-[:HAS_EVENT]->(event)
      RETURN event.id AS id, event.type AS type, event.content AS content, event.sortOrder AS sortOrder
    `);
  },

  /**
   * イベントを更新
   */
  async updateEvent(params: {
    id: string;
    type?: string;
    content?: string;
    sortOrder?: number;
  }) {
    const setClauses: string[] = [];
    if (params.type !== undefined) {
      setClauses.push(`event.type = '${params.type}'`);
    }
    if (params.content !== undefined) {
      setClauses.push(
        `event.content = '${escapeCypherString(params.content)}'`,
      );
    }
    if (params.sortOrder !== undefined) {
      setClauses.push(`event.sortOrder = ${params.sortOrder}`);
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    return executeQuery(`
      MATCH (event:SceneEvent {id: '${params.id}'})
      SET ${setClauses.join(', ')}
      RETURN event.id AS id, event.type AS type, event.content AS content, event.sortOrder AS sortOrder
    `);
  },

  /**
   * イベントを削除
   */
  async deleteEvent(id: string) {
    return executeQuery(`
      MATCH (event:SceneEvent {id: '${id}'})
      DETACH DELETE event
    `);
  },

  /**
   * 複数イベントの順序を一括更新
   */
  async updateEventOrder(eventOrders: { id: string; sortOrder: number }[]) {
    const queries = eventOrders.map(
      ({ id, sortOrder }) => `
      MATCH (event:SceneEvent {id: '${id}'})
      SET event.sortOrder = ${sortOrder}
    `,
    );

    return executeQuery(queries.join(';\n'));
  },
} as const;
