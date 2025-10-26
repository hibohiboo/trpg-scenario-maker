import { graphDbSchemas } from '@trpg-scenario-maker/graphdb';
import { BaseWorkerClient } from './BaseWorkerClient';
import type {
  GraphDBWorkerRequest,
  GraphDBWorkerResponse,
} from './graphdb.worker';
import DBWorker from './graphdb.worker?worker';

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

  async save(): Promise<void> {
    await Promise.all(nodes.map((schema) => this.saveNode(schema.name)));
    await Promise.all(
      relationships.map((schema) => this.saveEdge(schema.name)),
    );
  }

  async load(): Promise<void> {
    await Promise.all(schemas.map((schema) => this.loadTable(schema.name)));
  }

  private async createSchema(): Promise<void> {
    await Promise.all(schemas.map((schema) => this.execute(schema.query)));
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
