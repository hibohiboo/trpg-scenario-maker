import { BaseWorkerClient } from './BaseWorkerClient';
import type {
  GraphDBWorkerRequest,
  GraphDBWorkerResponse,
} from './graphdb.worker';

/**
 * GraphDBWorkerクライアント
 */
class GraphDBWorkerClient extends BaseWorkerClient<
  GraphDBWorkerRequest,
  GraphDBWorkerResponse
> {
  // eslint-disable-next-line class-methods-use-this
  protected getWorkerUrl(): URL {
    return new URL('./graphdb.worker.ts', import.meta.url);
  }

  /**
   * 初期化時にデータベースをセットアップ
   */
  protected async onInitialize(): Promise<void> {
    await this.sendRequest({ type: 'init' });
  }

  /**
   * クエリを実行
   */
  async execute<T = unknown>(query: string): Promise<T> {
    const response = await this.sendRequest<
      GraphDBWorkerResponse & { data: T }
    >({
      type: 'execute',
      payload: { query },
    });
    return response.data as T;
  }

  /**
   * データベースをクローズ
   */
  async close(): Promise<void> {
    await this.sendRequest({ type: 'close' });
  }
}

// シングルトンインスタンス
export const graphdbWorkerClient = new GraphDBWorkerClient();
