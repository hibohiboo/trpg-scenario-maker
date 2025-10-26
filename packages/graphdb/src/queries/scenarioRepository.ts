import { executeQuery } from '..';
import { escapeCypherString } from '../utils/escapeCypherString';

/**
 * シナリオのグラフDB操作リポジトリ
 */
export const scenarioGraphRepository = {
  /**
   * シナリオノードを作成
   */
  async create(params: { id: string; title: string }) {
    const escapedTitle = escapeCypherString(params.title);

    const result = (await executeQuery(`
      CREATE (s:Scenario {id: '${params.id}', title: '${escapedTitle}'})
      RETURN s
    `)) as {
      s: {
        _id: { offset: string; table: string };
        _LABEL: string;
        id: string;
        title: string;
      };
    }[];
    const [ret] = result;
    if (!ret) return undefined;

    return ret.s;
  },

  /**
   * シナリオノードを更新
   */
  async update(params: { id: string; title: string }) {
    const escapedTitle = escapeCypherString(params.title);
    return executeQuery(`
      MATCH (s:Scenario {id: '${params.id}'})
      SET s.title = '${escapedTitle}'
      RETURN s
    `);
  },

  /**
   * シナリオノードを削除
   */
  async delete(id: string) {
    return executeQuery(`
      MATCH (s:Scenario {id: '${id}'})
      DETACH DELETE s
    `);
  },

  /**
   * 全シナリオノードを取得
   */
  async findAll() {
    return executeQuery(`
      MATCH (s:Scenario)
      RETURN s
    `);
  },
} as const;
