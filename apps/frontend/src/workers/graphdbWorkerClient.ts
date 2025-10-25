import { BaseWorkerClient } from './BaseWorkerClient';
import type {
  GraphDBWorkerRequest,
  GraphDBWorkerResponse,
} from './graphdb.worker';
import DBWorker from './graphdb.worker?worker';

/**
 * GraphDBWorkerクライアント
 */
class GraphDBWorkerClient extends BaseWorkerClient<
  GraphDBWorkerRequest,
  GraphDBWorkerResponse
> {
  // eslint-disable-next-line class-methods-use-this
  protected getWorkerUrl(): URL | (new () => Worker) {
    // 開発環境では new URL() を使用（HMR対応）
    if (import.meta.env.DEV) {
      return new URL('./graphdb.worker.ts', import.meta.url);
    }
    // 本番ビルドでは ?worker インポートを使用
    return DBWorker;
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
   * クエリを実行
   */
  async save(): Promise<void> {
    const nodeFilename = '/node.csv';
    const nodeResponse = await this.sendRequest<GraphDBWorkerResponse>({
      type: 'save',
      payload: {
        filename: nodeFilename,
        query: `COPY (MATCH (n) RETURN n) TO '${nodeFilename}' (header=false);`,
      },
    });
    localStorage.setItem('graphdb_node_backup', nodeResponse.data as string);

    const relFilename = '/relation.csv';
    const relResponse = await this.sendRequest<GraphDBWorkerResponse>({
      type: 'save',
      payload: {
        filename: relFilename,
        query: `COPY (MATCH (a)-[e]->(b) RETURN a, e, b) TO '${relFilename}' (header=false);`,
      },
    });
    localStorage.setItem('graphdb_rel_backup', relResponse.data as string);
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
