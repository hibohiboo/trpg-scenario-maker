import type { BaseWorkerRequest, BaseWorkerResponse } from './types';

/**
 * Workerクライアントの基底クラス
 * 各エンティティ固有のWorkerクライアントはこのクラスを継承する
 */
export abstract class BaseWorkerClient<
  TRequest extends BaseWorkerRequest,
  TResponse extends BaseWorkerResponse,
> {
  protected worker: Worker | null = null;

  private messageId = 0;

  private pendingRequests = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >();

  /**
   * Worker URL/コンストラクタを返す（サブクラスで実装）
   */
  protected abstract getWorkerUrl(): URL | (new () => Worker);

  /**
   * Workerを初期化
   */
  async initialize(): Promise<void> {
    if (this.worker) {
      throw new Error(`${this.constructor.name} is already initialized`);
    }

    // Workerインスタンス作成
    const workerUrl = this.getWorkerUrl();
    this.worker =
      typeof workerUrl === 'function'
        ? // eslint-disable-next-line new-cap
          new workerUrl()
        : new Worker(workerUrl, { type: 'module' });

    // Workerからのレスポンスハンドラー設定
    this.worker.addEventListener(
      'message',
      this.handleWorkerMessage.bind(this),
    );
    this.worker.addEventListener('error', this.handleWorkerError.bind(this));

    // 初期化処理（サブクラスでオーバーライド可能）
    await this.onInitialize();
  }

  /**
   * 初期化時の追加処理（サブクラスでオーバーライド）
   */
  // eslint-disable-next-line class-methods-use-this
  protected async onInitialize(): Promise<void> {
    // デフォルトでは何もしない
  }

  /**
   * Workerからのメッセージを処理
   */
  private handleWorkerMessage(event: MessageEvent<TResponse & { id: number }>) {
    const { id, ...response } = event.data;
    const pending = this.pendingRequests.get(id);

    if (!pending) {
      console.warn(`No pending request found for message ID: ${id}`);
      return;
    }

    this.pendingRequests.delete(id);

    if ('error' in response && response.error) {
      pending.reject(new Error(response.error as string));
    } else {
      pending.resolve(response);
    }
  }

  /**
   * Workerエラーハンドラー
   */
  private handleWorkerError(error: ErrorEvent) {
    console.error(`${this.constructor.name} error:`, error);
    // 全ての待機中リクエストをreject
    this.pendingRequests.forEach((pending) => {
      pending.reject(new Error('Worker error occurred'));
    });
    this.pendingRequests.clear();
  }

  /**
   * Workerにリクエストを送信し、レスポンスを待機
   */
  protected sendRequest<T extends TResponse>(request: TRequest): Promise<T> {
    if (!this.worker) {
      return Promise.reject(
        new Error(`${this.constructor.name} is not initialized`),
      );
    }

    const id = this.messageId + 1;
    this.messageId = id;

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.worker!.postMessage({ id, ...request });
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
