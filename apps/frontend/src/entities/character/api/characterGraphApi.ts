import type { Character } from '@trpg-scenario-maker/schema';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

/**
 * キャラクターグラフDB API
 * GraphDBWorkerClientを使用して、キャラクター固有のAPI操作を提供
 */
export const characterGraphApi = {
  /**
   * キャラクター一覧を取得
   */
  async getList(): Promise<Character[]> {
    const result = await graphdbWorkerClient.request<Character[]>(
      'character:graph:getList',
    );
    return result;
  },

  /**
   * IDでキャラクターを取得
   */
  async getById(id: string): Promise<Character | undefined> {
    const result = await graphdbWorkerClient.request<Character[]>(
      'character:graph:getById',
      { id },
    );
    return result.length > 0 ? result[0] : undefined;
  },

  /**
   * キャラクターを作成
   */
  async create(params: {
    id: string;
    name: string;
    description: string;
  }): Promise<Character> {
    const result = await graphdbWorkerClient.request<Character[]>(
      'character:graph:create',
      params,
    );

    if (result.length === 0) {
      throw new Error(
        'Failed to create character: No result returned from database',
      );
    }

    return result[0];
  },

  /**
   * キャラクターを更新
   */
  async update(params: {
    id: string;
    name: string;
    description: string;
  }): Promise<Character> {
    const result = await graphdbWorkerClient.request<Character[]>(
      'character:graph:update',
      params,
    );

    if (result.length === 0) {
      throw new Error(
        'Failed to update character: Character not found or no result returned',
      );
    }

    return result[0];
  },

  /**
   * キャラクターを削除
   */
  async delete(id: string): Promise<void> {
    await graphdbWorkerClient.request('character:graph:delete', { id });
  },
} as const;
