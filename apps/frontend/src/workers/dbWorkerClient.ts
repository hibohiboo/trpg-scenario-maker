import type { NewScenario, Scenario } from '@trpg-scenario-maker/rdb/schema';
import type { DBWorkerRequest, DBWorkerResponse } from './db.worker';

class DBWorkerClient {
  private worker: Worker | null = null;

  private messageId = 0;

  private pendingRequests = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >();

  /**
   * Workerを初期化し、マイグレーションを実行
   */
  async initialize(): Promise<void> {
    if (this.worker) {
      throw new Error('DBWorkerClient is already initialized');
    }

    // Workerインスタンス作成
    this.worker = new Worker(new URL('./db.worker.ts', import.meta.url), {
      type: 'module',
    });

    // Workerからのレスポンスハンドラー設定
    this.worker.addEventListener(
      'message',
      this.handleWorkerMessage.bind(this),
    );
    this.worker.addEventListener('error', this.handleWorkerError.bind(this));

    // マイグレーション実行
    await this.sendRequest({ type: 'migrate' });
  }

  /**
   * Workerからのメッセージを処理
   */
  private handleWorkerMessage(
    event: MessageEvent<DBWorkerResponse & { id: number }>,
  ) {
    const { id, ...response } = event.data;
    const pending = this.pendingRequests.get(id);

    if (!pending) {
      console.warn(`No pending request found for message ID: ${id}`);
      return;
    }

    this.pendingRequests.delete(id);

    if (response.type === 'error') {
      pending.reject(new Error(response.error));
    } else {
      pending.resolve(response);
    }
  }

  /**
   * Workerエラーハンドラー
   */
  private handleWorkerError(error: ErrorEvent) {
    console.error('DBWorker error:', error);
    // 全ての待機中リクエストをreject
    this.pendingRequests.forEach((pending) => {
      pending.reject(new Error('Worker error occurred'));
    });
    this.pendingRequests.clear();
  }

  /**
   * Workerにリクエストを送信し、レスポンスを待機
   */
  private sendRequest<T extends DBWorkerResponse>(
    request: DBWorkerRequest,
  ): Promise<T> {
    if (!this.worker) {
      return Promise.reject(new Error('DBWorkerClient is not initialized'));
    }

    const id = this.messageId++;

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.worker!.postMessage({ id, ...request });
    });
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
  async createScenario(scenario: NewScenario): Promise<Scenario> {
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
    data: Partial<NewScenario>,
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

  /**
   * Workerを終了
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.pendingRequests.clear();
    }
  }
}

// シングルトンインスタンス
export const dbWorkerClient = new DBWorkerClient();
