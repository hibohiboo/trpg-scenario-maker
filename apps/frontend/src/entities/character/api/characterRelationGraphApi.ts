import type { Relationship } from '@trpg-scenario-maker/schema';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import type { CharacterRelationGraphHandlerMap } from '../workers/characterRelationGraphHandlers';

/**
 * キャラクター関係性グラフDB API
 * GraphDBWorkerClientを使用して、キャラクター関係性固有のAPI操作を提供
 */
export const characterRelationGraphApi = {
  /**
   * 関係性を作成
   */
  async create(params: {
    id: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }): Promise<Relationship> {
    const key = 'characterRelation:graph:create';
    const result = await graphdbWorkerClient.request<
      CharacterRelationGraphHandlerMap[typeof key]
    >(key, params);

    return result;
  },

  /**
   * 関係性を更新
   */
  async update(params: {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }): Promise<Relationship> {
    const key = 'characterRelation:graph:update';
    const result = await graphdbWorkerClient.request<
      CharacterRelationGraphHandlerMap[typeof key]
    >(key, params);

    return result;
  },

  /**
   * 関係性を削除
   */
  async delete(params: {
    fromCharacterId: string;
    toCharacterId: string;
  }): Promise<void> {
    const key = 'characterRelation:graph:delete';
    await graphdbWorkerClient.request<
      CharacterRelationGraphHandlerMap[typeof key]
    >(key, params);
  },

  /**
   * キャラクターの全関係性を取得
   */
  async getByCharacterId(characterId: string): Promise<{
    outgoing: Relationship[];
    incoming: Relationship[];
  }> {
    const key = 'characterRelation:graph:getByCharacterId';
    return graphdbWorkerClient.request<
      CharacterRelationGraphHandlerMap[typeof key]
    >(key, { characterId });
  },

  /**
   * 全関係性を取得
   */
  async getAll(): Promise<Relationship[]> {
    const key = 'characterRelation:graph:getAll';
    return graphdbWorkerClient.request<
      CharacterRelationGraphHandlerMap[typeof key]
    >(key);
  },
} as const;
