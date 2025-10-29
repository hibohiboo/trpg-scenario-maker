import { relationshipGraphRepository } from '@trpg-scenario-maker/graphdb';
import type { Relationship } from '@trpg-scenario-maker/schema';

/**
 * キャラクター関係性グラフDB API
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
    const result = await relationshipGraphRepository.create(params);
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as Relationship;
    }
    throw new Error('Failed to create character relation');
  },

  /**
   * 関係性を更新
   */
  async update(params: {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }): Promise<Relationship> {
    const result = await relationshipGraphRepository.update(params);
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as Relationship;
    }
    throw new Error('Failed to update character relation');
  },

  /**
   * 関係性を削除
   */
  async delete(params: {
    fromCharacterId: string;
    toCharacterId: string;
  }): Promise<void> {
    await relationshipGraphRepository.delete(params);
  },

  /**
   * キャラクターの全関係性を取得
   */
  async getByCharacterId(characterId: string): Promise<{
    outgoing: Relationship[];
    incoming: Relationship[];
  }> {
    return relationshipGraphRepository.findByCharacterId(characterId);
  },

  /**
   * 全関係性を取得
   */
  async getAll(): Promise<Relationship[]> {
    return relationshipGraphRepository.findAll();
  },
} as const;
