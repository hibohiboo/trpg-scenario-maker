import { BaseWorkerClient } from './BaseWorkerClient';
import DBWorker from './db.worker?worker';
import type { DBWorkerRequest, DBWorkerResponse } from './db.worker';
import type { GlobalRdbHandlerMap } from './types/handlerMaps';

/**
 * DBWorkerクライアント（汎用）
 * エンティティ固有のロジックは含まない
 */
class DBWorkerClient extends BaseWorkerClient<
  DBWorkerRequest,
  DBWorkerResponse
> {
  // eslint-disable-next-line class-methods-use-this
  protected getWorkerUrl(): URL | (new () => Worker) {
    // 開発環境では new URL() を使用（HMR対応）
    if (import.meta.env.DEV) {
      return new URL('./db.worker.ts', import.meta.url);
    }
    // 本番ビルドでは ?worker インポートを使用
    return DBWorker;
  }

  /**
   * 初期化時にマイグレーションを実行
   */
  protected async onInitialize(): Promise<void> {
    await this.sendRequest({ type: 'migrate' });
  }

  /**
   * 汎用リクエスト送信メソッド
   * エンティティAPIから直接使用される
   */
  async request<K extends keyof GlobalRdbHandlerMap>(
    type: K,
    payload?: unknown,
  ): Promise<GlobalRdbHandlerMap[K]> {
    const response = await this.sendRequest<
      DBWorkerResponse & { data: GlobalRdbHandlerMap[K] }
    >({
      type,
      payload,
    });
    return response.data as GlobalRdbHandlerMap[K];
  }
}

// シングルトンインスタンス
export const dbWorkerClient = new DBWorkerClient();
