import type { Relationship } from '@trpg-scenario-maker/schema';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

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
    const result = await graphdbWorkerClient.request(
      'characterRelation:graph:create',
      params,
    );

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
    const result = await graphdbWorkerClient.request(
      'characterRelation:graph:update',
      params,
    );

    return result;
  },

  /**
   * 関係性を削除
   */
  async delete(params: {
    fromCharacterId: string;
    toCharacterId: string;
  }): Promise<void> {
    await graphdbWorkerClient.request('characterRelation:graph:delete', params);
  },

  /**
   * キャラクターの全関係性を取得
   */
  async getByCharacterId(characterId: string): Promise<{
    outgoing: Relationship[];
    incoming: Relationship[];
  }> {
    return graphdbWorkerClient.request(
      'characterRelation:graph:getByCharacterId',
      { characterId },
    );
  },

  /**
   * 全関係性を取得
   */
  async getAll(): Promise<Relationship[]> {
    return graphdbWorkerClient.request('characterRelation:graph:getAll');
  },
} as const;
