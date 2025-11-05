import type { Image } from '@trpg-scenario-maker/schema';
import { dbWorkerClient } from '@/workers/dbWorkerClient';

/**
 * 画像RDB API
 * DBWorkerClientを使用して、画像データのCRUD操作を提供
 */
export const imageRdbApi = {
  /**
   * 画像を作成（Data URLを保存）
   */
  createImage: async (dataUrl: string): Promise<{ id: string }> => {
    const result = await dbWorkerClient.request<{ id: string }>(
      'image:rdb:create',
      { dataUrl },
    );

    return result;
  },

  /**
   * IDで画像を取得
   */
  getImageById: async (id: string): Promise<Image | null> => {
    const result = await dbWorkerClient.request<Image | null>(
      'image:rdb:getById',
      { id },
    );

    return result;
  },

  /**
   * 複数のIDで画像を取得
   */
  getImagesByIds: async (ids: string[]): Promise<Image[]> => {
    const result = await dbWorkerClient.request<Image[]>('image:rdb:getByIds', {
      ids,
    });

    return result;
  },

  /**
   * 画像を削除
   */
  deleteImage: async (id: string): Promise<void> => {
    await dbWorkerClient.request('image:rdb:delete', { id });
  },
} as const;
