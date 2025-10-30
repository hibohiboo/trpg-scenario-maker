import { graphDbSchemas } from '@trpg-scenario-maker/graphdb';
import { BaseWorkerClient } from './BaseWorkerClient';
import type {
  GraphDBWorkerRequest,
  GraphDBWorkerResponse,
} from './graphdb.worker';
import DBWorker from './graphdb.worker?worker';
import type { GlobalHandlerMap } from './types/handlerMaps';

const { nodes, relationships } = graphDbSchemas;
const schemas = [...nodes, ...relationships];

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

  /**
   * 汎用リクエスト送信メソッド
   * エンティティAPIから直接使用される
   */
  async request<K extends keyof GlobalHandlerMap>(
    type: K,
    payload?: unknown,
  ): Promise<GlobalHandlerMap[K]> {
    const response = await this.sendRequest<
      GraphDBWorkerResponse & { data: GlobalHandlerMap[K] }
    >({
      type,
      payload,
    });
    return response.data as GlobalHandlerMap[K];
  }

  async save(): Promise<void> {
    await Promise.all(nodes.map((schema) => this.saveNode(schema.name)));
    await Promise.all(
      relationships.map((schema) => this.saveEdge(schema.name)),
    );
  }

  async load(): Promise<void> {
    await Promise.all(schemas.map((schema) => this.loadTable(schema.name)));
    await this.ensureInitialData();
  }

  private async ensureInitialData(): Promise<void> {
    // シナリオの存在確認
    const scenarios = await this.execute<
      { s: { id: string; title: string } }[]
    >(`
      MATCH (s:Scenario)
      RETURN s
    `);

    // シナリオが存在しない場合、初期データを登録
    if (!scenarios || scenarios.length === 0) {
      await this.execute(`
        CREATE (s:Scenario {id: '3f81c321-1941-4247-9f5d-37bb6a9e8e45', title: 'サンプルシナリオ'})
        RETURN s
      `);
      await this.save();
    }
  }

  private async createSchema(): Promise<void> {
    await Promise.all(schemas.map((schema) => this.execute(schema.query)));
  }

  private async saveNode(tableName: string): Promise<void> {
    const nodeFilename = `/${tableName}.csv`;
    await this.sendRequest<GraphDBWorkerResponse>({
      type: 'save',
      payload: {
        path: nodeFilename,
        query: `COPY (MATCH (n:${tableName}) RETURN n.*) TO '${nodeFilename}' (header=false);`,
      },
    });
  }

  private async saveEdge(tableName: string): Promise<void> {
    const edgeFilename = `/${tableName}.csv`;
    await this.sendRequest<GraphDBWorkerResponse>({
      type: 'save',
      payload: {
        path: edgeFilename,
        query: `COPY (MATCH (a)-[f:${tableName}]->(b) RETURN a.id, b.id) TO '${edgeFilename}' (header=false, delim='|');`,
      },
    });
  }

  private async loadTable(tableName: string): Promise<void> {
    const path = `/${tableName}.csv`;
    await this.sendRequest<GraphDBWorkerResponse>({
      type: 'load',
      payload: {
        path,
        query: `COPY ${tableName} FROM '${path}'`,
      },
    });
  }
}

// シングルトンインスタンス
export const graphdbWorkerClient = new GraphDBWorkerClient();
