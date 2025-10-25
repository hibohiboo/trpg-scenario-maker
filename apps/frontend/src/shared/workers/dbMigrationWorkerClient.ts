import { BaseWorkerClient } from './BaseWorkerClient';
import type {
  DBMigrationWorkerRequest,
  DBMigrationWorkerResponse,
} from './dbMigration.worker';

/**
 * DB初期化Workerクライアント
 * アプリケーション起動時にマイグレーションを実行する
 */
class DBMigrationWorkerClient extends BaseWorkerClient<
  DBMigrationWorkerRequest,
  DBMigrationWorkerResponse
> {
  protected getWorkerUrl(): URL {
    return new URL('./dbMigration.worker.ts', import.meta.url);
  }

  /**
   * 初期化時にマイグレーションを自動実行
   */
  protected async onInitialize(): Promise<void> {
    await this.migrate();
  }

  /**
   * データベースマイグレーションを実行
   */
  async migrate(): Promise<void> {
    await this.sendRequest<{ type: 'migrate'; success: true }>({
      type: 'migrate',
    });
  }
}

// シングルトンインスタンス
export const dbMigrationWorkerClient = new DBMigrationWorkerClient();
