import { BaseWorkerClient } from './BaseWorkerClient';
import type { DBWorkerRequest, DBWorkerResponse } from './db.worker';
import DBWorker from './db.worker?worker';

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
  async request<T = unknown>(type: string, payload?: unknown): Promise<T> {
    const response = await this.sendRequest<DBWorkerResponse & { data: T }>({
      type,
      payload,
    });
    return response.data as T;
  }
}

// シングルトンインスタンス
export const dbWorkerClient = new DBWorkerClient();
