import type { Character } from '@trpg-scenario-maker/schema';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import type { CharacterGraphHandlerMap } from '../workers/characterGraphHandlers';

/**
 * キャラクターグラフDB API
 * GraphDBWorkerClientを使用して、キャラクター固有のAPI操作を提供
 */
export const characterGraphApi = {
  /**
   * キャラクター一覧を取得
   */
  async getList(): Promise<Character[]> {
    const key = 'character:graph:getList';
    const result = await graphdbWorkerClient.request<
      CharacterGraphHandlerMap[typeof key]
    >(key);

    return result;
  },

  /**
   * IDでキャラクターを取得
   */
  async getById(id: string): Promise<Character | undefined> {
    const key = 'character:graph:getById';
    const result = await graphdbWorkerClient.request<
      CharacterGraphHandlerMap[typeof key]
    >(key, { id });

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
    const key = 'character:graph:create';
    const result = await graphdbWorkerClient.request<
      CharacterGraphHandlerMap[typeof key]
    >(key, params);

    return result;
  },

  /**
   * キャラクターを更新
   */
  async update(params: {
    id: string;
    name: string;
    description: string;
  }): Promise<Character> {
    const key = 'character:graph:update';
    const result = await graphdbWorkerClient.request<
      CharacterGraphHandlerMap[typeof key]
    >(key, params);

    return result;
  },

  /**
   * キャラクターを削除
   */
  async delete(id: string): Promise<void> {
    const key = 'character:graph:delete';
    await graphdbWorkerClient.request<CharacterGraphHandlerMap[typeof key]>(
      key,
      { id },
    );
  },
} as const;
