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
    await this.createSchema();
    await this.load();
  }

  /**
   * データベースをクローズ
   */
  async close(): Promise<void> {
    await this.sendRequest({ type: 'close' });
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

  async save(): Promise<void> {
    await this.saveNode('Scenario');
    await this.saveNode('Scene');
    await this.saveEdge('HAS_SCENE');
    await this.saveEdge('NEXT_SCENE');
  }

  async load(): Promise<void> {
    await this.loadTable('Scenario');
    await this.loadTable('Scene');
    await this.loadTable('HAS_SCENE');
    await this.loadTable('NEXT_SCENE');
  }

  private async createSchema(): Promise<void> {
    // ノードテーブル
    await this.execute(`
      CREATE NODE TABLE Scenario (
        id STRING,
        title STRING,
        PRIMARY KEY (id)
      )
    `);
    await this.execute(`
      CREATE NODE TABLE Scene (
        id STRING,
        title STRING,
        isMasterScene BOOL,
        description STRING,
        PRIMARY KEY (id)
      )
    `);
    // リレーションテーブル
    await this.execute(`
      CREATE REL TABLE HAS_SCENE (
        FROM Scenario TO Scene
      )
    `);
    await this.execute(`
      CREATE REL TABLE NEXT_SCENE (
          FROM Scene TO Scene
      )
    `);
  }

  private async saveNode(tableName: string): Promise<void> {
    const nodeFilename = `/${tableName}.csv`;
    const nodeResponse = await this.sendRequest<GraphDBWorkerResponse>({
      type: 'save',
      payload: {
        path: nodeFilename,
        query: `COPY (MATCH (n:${tableName}) RETURN n.*) TO '${nodeFilename}' (header=false);`,
      },
    });
    localStorage.setItem(nodeFilename, nodeResponse.data as string);
  }

  private async saveEdge(tableName: string): Promise<void> {
    const edgeFilename = `/${tableName}.csv`;
    const edgeResponse = await this.sendRequest<GraphDBWorkerResponse>({
      type: 'save',
      payload: {
        path: edgeFilename,
        query: `COPY (MATCH (a)-[f:${tableName}]->(b) RETURN a.id, b.id) TO '${edgeFilename}' (header=false, delim='|');`,
      },
    });
    localStorage.setItem(edgeFilename, edgeResponse.data as string);
  }

  private async loadTable(tableName: string): Promise<void> {
    const path = `/${tableName}.csv`;
    await this.sendRequest<GraphDBWorkerResponse>({
      type: 'load',
      payload: {
        path,
        query: `COPY ${tableName} FROM '${path}'`,
        content: localStorage.getItem(path) ?? '',
      },
    });
  }
}

// シングルトンインスタンス
export const graphdbWorkerClient = new GraphDBWorkerClient();
