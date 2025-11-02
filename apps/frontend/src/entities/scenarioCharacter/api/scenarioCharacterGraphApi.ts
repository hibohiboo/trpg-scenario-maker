import type { ScenarioCharacter } from '@trpg-scenario-maker/schema';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

/**
 * シナリオ×キャラクターグラフDB API
 * GraphDBWorkerClientを使用して、シナリオ×キャラクター関係の操作を提供
 */
export const scenarioCharacterGraphApi = {
  /**
   * キャラクターをシナリオに追加
   */
  async addToScenario(params: {
    scenarioId: string;
    characterId: string;
    role?: string;
  }): Promise<ScenarioCharacter> {
    const result = await graphdbWorkerClient.request(
      'scenarioCharacter:graph:addToScenario',
      params,
    );

    return result;
  },

  /**
   * シナリオからキャラクターを削除
   */
  async removeFromScenario(params: {
    scenarioId: string;
    characterId: string;
  }): Promise<void> {
    await graphdbWorkerClient.request(
      'scenarioCharacter:graph:removeFromScenario',
      params,
    );
  },

  /**
   * シナリオ内でのキャラクターの役割を更新
   */
  async updateRole(params: {
    scenarioId: string;
    characterId: string;
    role: string;
  }): Promise<ScenarioCharacter> {
    const result = await graphdbWorkerClient.request(
      'scenarioCharacter:graph:updateRole',
      params,
    );

    return result;
  },

  /**
   * シナリオに登場するキャラクター一覧を取得
   */
  async getByScenarioId(scenarioId: string): Promise<ScenarioCharacter[]> {
    const result = await graphdbWorkerClient.request(
      'scenarioCharacter:graph:getByScenarioId',
      { scenarioId },
    );

    return result;
  },
} as const;
