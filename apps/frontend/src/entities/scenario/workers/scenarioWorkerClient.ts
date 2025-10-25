import type { Scenario } from '@trpg-scenario-maker/rdb/schema';
import { BaseWorkerClient } from '@/shared/workers/BaseWorkerClient';
import type {
  ScenarioWorkerRequest,
  ScenarioWorkerResponse,
  UpdateScenarioData,
} from './scenario.worker';

/**
 * シナリオWorkerクライアント
 */
class ScenarioWorkerClient extends BaseWorkerClient<
  ScenarioWorkerRequest,
  ScenarioWorkerResponse
> {
  protected getWorkerUrl(): URL {
    return new URL('./scenario.worker.ts', import.meta.url);
  }

  /**
   * シナリオ一覧を取得
   */
  async getScenarios(): Promise<Scenario[]> {
    const response = await this.sendRequest<{
      type: 'getScenarios';
      data: Scenario[];
    }>({
      type: 'getScenarios',
    });
    return response.data;
  }

  /**
   * シナリオ数を取得
   */
  async getScenarioCount(): Promise<number> {
    const response = await this.sendRequest<{
      type: 'getScenarioCount';
      data: number;
    }>({
      type: 'getScenarioCount',
    });
    return response.data;
  }

  /**
   * シナリオを作成
   */
  async createScenario(scenario: {
    id: string;
    title: string;
  }): Promise<Scenario> {
    const response = await this.sendRequest<{
      type: 'createScenario';
      data: Scenario;
    }>({
      type: 'createScenario',
      payload: scenario,
    });
    return response.data;
  }

  /**
   * シナリオを更新
   */
  async updateScenario(
    id: string,
    data: UpdateScenarioData,
  ): Promise<Scenario> {
    const response = await this.sendRequest<{
      type: 'updateScenario';
      data: Scenario;
    }>({
      type: 'updateScenario',
      payload: { id, data },
    });
    return response.data;
  }

  /**
   * シナリオを削除
   */
  async deleteScenario(id: string): Promise<void> {
    await this.sendRequest<{ type: 'deleteScenario'; success: true }>({
      type: 'deleteScenario',
      payload: { id },
    });
  }
}

// シングルトンインスタンス
export const scenarioWorkerClient = new ScenarioWorkerClient();
