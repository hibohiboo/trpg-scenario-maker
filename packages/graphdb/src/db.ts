// eslint-disable-next-line camelcase
import kuzu_wasm from '@kuzu/kuzu-wasm';
import type { Database, Connection } from '@kuzu/kuzu-wasm';

let db: Database | null = null;
let connection: Connection | null = null;

/**
 * スキーマを作成（NODE TABLEとREL TABLE）
 */
async function createSchema(): Promise<void> {
  if (!connection) {
    throw new Error('Database connection not initialized');
  }

  // Scenarioノードテーブル
  await connection.execute(`
    CREATE NODE TABLE Scenario (
      id STRING,
      title STRING,
      PRIMARY KEY (id)
    )
  `);

  // Sceneノードテーブル
  await connection.execute(`
    CREATE NODE TABLE Scene (
      id STRING,
      title STRING,
      isMasterScene BOOL,
      description STRING,
      PRIMARY KEY (id)
    )
  `);

  // リレーションテーブル
  await connection.execute(`
    CREATE REL TABLE HAS_SCENE (
      FROM Scenario TO Scene
    )
  `);

  // シーンの順序関係（通常の遷移）
  await connection.execute(`
    CREATE REL TABLE NEXT_SCENE (
        FROM Scene TO Scene
    )
  `);
}

/**
 * Kùzuデータベースを初期化し、スキーマを作成
 */
export async function initializeDatabase(): Promise<void> {
  // Kùzu WASMモジュールを初期化
  const kuzu = await kuzu_wasm();

  // インメモリデータベースを作成
  db = await kuzu.Database();

  // 接続を確立
  connection = await kuzu.Connection(db);

  // スキーマを作成
  await createSchema();
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
    return [];
  }

  return JSON.parse(result.table.toString());
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
