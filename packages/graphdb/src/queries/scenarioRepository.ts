import { executeQuery } from '..';

/**
 * シナリオのグラフDB操作リポジトリ
 */
export const scenarioGraphRepository = {
  /**
   * シナリオノードを作成
   */
  async create(params: { id: string; title: string }) {
    return executeQuery(`
      CREATE (s:Scenario {id: '${params.id}', title: '${params.title}'})
      RETURN s
    `);
  },

  /**
   * シナリオノードを更新
   */
  async update(params: { id: string; title: string }) {
    return executeQuery(`
      MATCH (s:Scenario {id: '${params.id}'})
      SET s.title = '${params.title}'
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
