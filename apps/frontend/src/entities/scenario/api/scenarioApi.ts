import { dbWorkerClient } from '@/workers/dbWorkerClient';

/**
 * シナリオAPI
 * DBWorkerClientの汎用requestメソッドを使用して、シナリオ固有のAPIを提供
 */
export const scenarioApi = {
  /**
   * シナリオ一覧を取得
   */
  getList: () => dbWorkerClient.request('scenario:getList'),

  /**
   * シナリオ数を取得
   */
  getCount: () => dbWorkerClient.request('scenario:getCount'),

  /**
   * シナリオを作成
   */
  create: (params: { id: string; title: string }) =>
    dbWorkerClient.request('scenario:create', params),

  /**
   * シナリオを更新
   */
  update: (id: string, data: { title: string }) =>
    dbWorkerClient.request('scenario:update', { id, data }),

  /**
   * シナリオを削除
   */
  delete: (id: string) => dbWorkerClient.request('scenario:delete', { id }),
} as const;
