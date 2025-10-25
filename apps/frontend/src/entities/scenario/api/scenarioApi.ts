import type { Scenario } from '@trpg-scenario-maker/rdb/schema';
import { dbWorkerClient } from '@/workers/dbWorkerClient';

/**
 * シナリオAPI
 * DBWorkerClientの汎用requestメソッドを使用して、シナリオ固有のAPIを提供
 */
export const scenarioApi = {
  /**
   * シナリオ一覧を取得
   */
  getList: (): Promise<Scenario[]> =>
    dbWorkerClient.request<Scenario[]>('scenario:getList'),

  /**
   * シナリオ数を取得
   */
  getCount: (): Promise<number> =>
    dbWorkerClient.request<number>('scenario:getCount'),

  /**
   * シナリオを作成
   */
  create: (params: { id: string; title: string }): Promise<Scenario> =>
    dbWorkerClient.request<Scenario>('scenario:create', params),

  /**
   * シナリオを更新
   */
  update: (id: string, data: { title: string }): Promise<Scenario> =>
    dbWorkerClient.request<Scenario>('scenario:update', { id, data }),

  /**
   * シナリオを削除
   */
  delete: (id: string): Promise<void> =>
    dbWorkerClient.request<void>('scenario:delete', { id }),
} as const;
