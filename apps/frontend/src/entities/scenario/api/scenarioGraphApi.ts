import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

/**
 * シナリオのグラフDB操作API
 * GraphDBWorkerClientを使用して、シナリオ固有のAPI操作を提供
 */
export const scenarioGraphApi = {
  /**
   * シナリオノードを作成
   */
  create: (params: { id: string; title: string }) =>
    graphdbWorkerClient.request('scenario:graph:create', params),

  /**
   * シナリオノードを更新
   */
  update: (params: { id: string; title: string }) =>
    graphdbWorkerClient.request('scenario:graph:update', params),

  /**
   * シナリオノードを削除
   */
  delete: (id: string) =>
    graphdbWorkerClient.request('scenario:graph:delete', { id }),

  /**
   * 全シナリオノードを取得
   */
  findAll: () => graphdbWorkerClient.request('scenario:graph:findAll'),

  /**
   * データベースを永続化
   */
  save: async () => {
    await graphdbWorkerClient.save();
  },

  /**
   * シナリオのGraphDBデータをエクスポート
   */
  exportScenario: (scenarioId: string) =>
    graphdbWorkerClient.request('exportScenarioGraph', { scenarioId }),

  /**
   * シナリオのGraphDBデータをインポート
   */
  importScenario: (params: { nodes: unknown[]; relationships: unknown[] }) =>
    graphdbWorkerClient.request('importScenarioGraph', params),
} as const;
