import type { Image } from '@trpg-scenario-maker/schema';
import { rdbWorkerClient } from '@/workers/rdbWorkerClient';

/**
 * 画像RDB API
 * RDBWorkerClientを使用して、画像データのCRUD操作を提供
 */
export const imageRdbApi = {
  /**
   * 画像を作成（Data URLを保存）
   */
  async create(dataUrl: string): Promise<{ id: string }> {
    const result = await rdbWorkerClient.request('image:rdb:create', {
      dataUrl,
    });

    return result;
  },

  /**
   * IDで画像を取得
   */
  async getById(id: string): Promise<Image | null> {
    const result = await rdbWorkerClient.request('image:rdb:getById', { id });

    return result;
  },

  /**
   * 複数のIDで画像を取得
   */
  async getByIds(ids: string[]): Promise<Image[]> {
    const result = await rdbWorkerClient.request('image:rdb:getByIds', { ids });

    return result;
  },

  /**
   * 画像を削除
   */
  async delete(id: string): Promise<void> {
    await rdbWorkerClient.request('image:rdb:delete', { id });
  },
} as const;
