import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import type { ScenarioCharacterRelationship } from '@trpg-scenario-maker/schema';

/**
 * シナリオ内キャラクター関係性グラフDB API
 * GraphDBWorkerClientを使用して、シナリオ内キャラクター関係性の操作を提供
 */
export const scenarioCharacterRelationGraphApi = {
  /**
   * シナリオ内の関係性を作成
   */
  async create(params: {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }): Promise<ScenarioCharacterRelationship> {
    const result = await graphdbWorkerClient.request(
      'scenarioCharacterRelation:graph:create',
      params,
    );

    return result;
  },

  /**
   * シナリオ内の関係性を更新
   */
  async update(params: {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }): Promise<ScenarioCharacterRelationship> {
    const result = await graphdbWorkerClient.request(
      'scenarioCharacterRelation:graph:update',
      params,
    );

    return result;
  },

  /**
   * シナリオ内の関係性を削除
   */
  async delete(params: {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
  }): Promise<void> {
    await graphdbWorkerClient.request(
      'scenarioCharacterRelation:graph:delete',
      params,
    );
  },

  /**
   * シナリオ内の全関係性を取得
   */
  async getByScenarioId(
    scenarioId: string,
  ): Promise<ScenarioCharacterRelationship[]> {
    const result = await graphdbWorkerClient.request(
      'scenarioCharacterRelation:graph:getByScenarioId',
      { scenarioId },
    );

    return result;
  },

  /**
   * シナリオ内の特定キャラクターの関係性を取得（発信・受信両方）
   */
  async getByScenarioAndCharacterId(params: {
    scenarioId: string;
    characterId: string;
  }): Promise<{
    incoming: ScenarioCharacterRelationship[];
    outgoing: ScenarioCharacterRelationship[];
  }> {
    const result = await graphdbWorkerClient.request(
      'scenarioCharacterRelation:graph:getByScenarioAndCharacterId',
      params,
    );

    return result;
  },
} as const;
