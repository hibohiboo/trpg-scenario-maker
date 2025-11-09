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

  /**
   * メイン画像IDを含むキャラクター情報を取得
   */
  async findByIdWithPrimaryImage(id: string) {
    return executeQuery(`
      MATCH (c:Character {id: '${id}'})
      OPTIONAL MATCH (c)-[r:HAS_IMAGE {isPrimary: true}]->(i:Image)
      RETURN c.id AS id, c.name AS name, c.description AS description, i.id AS primaryImageId
    `);
  },

  /**
   * 全キャラクターをメイン画像IDと共に取得
   */
  async findAllWithPrimaryImage() {
    return executeQuery(`
      MATCH (c:Character)
      OPTIONAL MATCH (c)-[r:HAS_IMAGE {isPrimary: true}]->(i:Image)
      RETURN c.id AS id, c.name AS name, c.description AS description, i.id AS primaryImageId
    `);
  },
} as const;
