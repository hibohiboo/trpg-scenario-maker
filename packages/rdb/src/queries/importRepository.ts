import { imagesTable, scenariosTable } from '../schema';
import type { RDBData } from '@trpg-scenario-maker/schema';
import type { PgliteDatabase } from 'drizzle-orm/pglite';

/**
 * RDBインポート用リポジトリ（DI対応）
 */
export const createImportRepository = (
  database: PgliteDatabase<Record<string, unknown>>,
) => ({
  /**
   * RDBデータをインポート
   */
  async importScenario(data: RDBData): Promise<void> {
    // シナリオ挿入
    await database.insert(scenariosTable).values({
      id: data.scenario.id,
      title: data.scenario.title,
      createdAt: new Date(data.scenario.createdAt),
      updatedAt: new Date(data.scenario.updatedAt),
    });

    // 画像挿入
    if (data.images.length > 0) {
      await database.insert(imagesTable).values(
        data.images.map((img) => ({
          id: img.id,
          dataUrl: img.dataUrl,
          createdAt: new Date(img.createdAt),
        })),
      );
    }
  },
});
