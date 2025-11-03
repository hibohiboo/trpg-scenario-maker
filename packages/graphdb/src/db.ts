// eslint-disable-next-line camelcase
import kuzu_wasm from '@kuzu/kuzu-wasm';
import { sampleHasScene, sampleScenaData } from './migration';
import type { Database, Connection, KuzuModule } from '@kuzu/kuzu-wasm';

let kuzu: KuzuModule | null = null;
let db: Database | null = null;
let connection: Connection | null = null;

/**
 * Kùzuデータベースを初期化し、スキーマを作成
 */
export async function initializeDatabase(): Promise<void> {
  // Kùzu WASMモジュールを初期化
  kuzu = await kuzu_wasm();

  // インメモリデータベースを作成
  db = await kuzu.Database();

  // 接続を確立
  connection = await kuzu.Connection(db);
}

/**
 * データベース接続を取得
 */
export function getConnection(): Connection {
  if (!connection) {
    throw new Error(
      'Database connection not initialized. Call initializeDatabase first.',
    );
  }
  return connection;
}

/**
 * クエリを実行してJSONデータを返す
 */
export async function executeQuery(query: string): Promise<unknown> {
  if (!connection) {
    throw new Error(
      'Database connection not initialized. Call initializeDatabase first.',
    );
  }

  const result = await connection.execute(query);

  // result.tableが存在しない場合は空配列を返す
  if (!result.table) {
    globalThis.console.debug('graphdb execute:', result, query);
    return [];
  }

  const jsonString = result.table.toString();

  return JSON.parse(jsonString);
}

export function readFSVFile(path: string): string {
  if (!kuzu) {
    throw new Error('Kùzu FS is not initialized');
  }
  return kuzu.FS.readFile(path, { encoding: 'utf8' });
}

export function writeFSVFile(path: string, content: string): void {
  if (!kuzu) {
    throw new Error('Kùzu FS is not initialized');
  }
  kuzu.FS.writeFile(path, content);
}
/**
 * データベースを閉じる
 */
export async function closeDatabase(): Promise<void> {
  if (connection) {
    connection.close();
    connection = null;
  }
  if (db) {
    db.close();
    db = null;
  }
}

export async function initSampleData() {
  await executeQuery(`
        CREATE (s:Scenario {id: '3f81c321-1941-4247-9f5d-37bb6a9e8e45', title: 'サンプルシナリオ'})
        RETURN s
      `);
  writeFSVFile(sampleScenaData.key, sampleScenaData.value);
  await executeQuery(
    `COPY ${sampleScenaData.table} FROM "${sampleScenaData.key}"`,
  );
  writeFSVFile(sampleHasScene.key, sampleHasScene.value);
  await executeQuery(
    `COPY ${sampleHasScene.table} FROM "${sampleHasScene.key}"`,
  );
}
