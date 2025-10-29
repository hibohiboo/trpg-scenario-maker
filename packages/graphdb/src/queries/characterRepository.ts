import { executeQuery } from '..';
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

    const result = await executeQuery(`
      CREATE (c:Character {id: '${params.id}', name: '${escapedName}', description: '${escapedDescription}'})
      RETURN c.id AS id, c.name AS name, c.description AS description
    `);

    return result;
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
      RETURN c
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
    const result = (await executeQuery(`
      MATCH (c:Character)
      RETURN c
    `)) as {
      c: {
        _id: { offset: string; table: string };
        _LABEL: string;
        id: string;
        name: string;
        description: string;
      };
    }[];

    return result.map((row) => row.c);
  },

  /**
   * IDでキャラクターを取得
   */
  async findById(id: string) {
    const result = (await executeQuery(`
      MATCH (c:Character {id: '${id}'})
      RETURN c
    `)) as {
      c: {
        _id: { offset: string; table: string };
        _LABEL: string;
        id: string;
        name: string;
        description: string;
      };
    }[];

    const [ret] = result;
    return ret ? ret.c : undefined;
  },
} as const;
