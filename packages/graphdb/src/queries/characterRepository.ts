import { executeQuery } from '../db';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * キャラクターのグラフDB操作リポジトリ
 */
export const characterGraphRepository = {
  /**
   * キャラクターノードを作成
   */
  async create(params: { id: string; name: string; description: string }) {
    const escapedName = escapeCypherString(params.name);
    const escapedDescription = escapeCypherString(params.description);

    return executeQuery(`
      CREATE (c:Character {id: '${params.id}', name: '${escapedName}', description: '${escapedDescription}'})
      RETURN c.id AS id, c.name AS name, c.description AS description
    `);
  },

  /**
   * キャラクターノードを更新
   */
  async update(params: { id: string; name: string; description: string }) {
    const escapedName = escapeCypherString(params.name);
    const escapedDescription = escapeCypherString(params.description);
    return executeQuery(`
      MATCH (c:Character {id: '${params.id}'})
      SET c.name = '${escapedName}', c.description = '${escapedDescription}'
      RETURN c.id AS id, c.name AS name, c.description AS description
    `);
  },

  /**
   * キャラクターノードを削除
   */
  async delete(id: string) {
    return executeQuery(`
      MATCH (c:Character {id: '${id}'})
      DETACH DELETE c
    `);
  },

  /**
   * 全キャラクターノードを取得
   */
  async findAll() {
    return executeQuery(`
      MATCH (c:Character)
      RETURN c.id AS id, c.name AS name, c.description AS description
    `);
  },

  /**
   * IDでキャラクターを取得
   */
  async findById(id: string) {
    return executeQuery(`
      MATCH (c:Character {id: '${id}'})
      RETURN c.id AS id, c.name AS name, c.description AS description
    `);
  },
} as const;
