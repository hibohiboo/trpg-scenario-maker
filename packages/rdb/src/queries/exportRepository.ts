import { eq, inArray } from 'drizzle-orm';
import { imagesTable, scenariosTable } from '../schema';
import type { RDBData } from '@trpg-scenario-maker/schema';
import type { PgliteDatabase } from 'drizzle-orm/pglite';

/**
 * RDBエクスポート用リポジトリ（DI対応）
 */
export const createExportRepository = (
  database: PgliteDatabase<Record<string, unknown>>,
) => ({
  /**
   * シナリオに関連する全RDBデータをエクスポート
   */
  async exportScenario(
    scenarioId: string,
    imageIds: string[],
  ): Promise<RDBData> {
    // シナリオ取得
    const [scenario] = await database
      .select({
        id: scenariosTable.id,
        title: scenariosTable.title,
        createdAt: scenariosTable.createdAt,
        updatedAt: scenariosTable.updatedAt,
      })
      .from(scenariosTable)
      .where(eq(scenariosTable.id, scenarioId));

    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }

    // 画像取得
    const images =
      imageIds.length > 0
        ? await database
            .select({
              id: imagesTable.id,
              dataUrl: imagesTable.dataUrl,
              createdAt: imagesTable.createdAt,
            })
            .from(imagesTable)
            .where(inArray(imagesTable.id, imageIds))
        : [];

    return {
      scenario: {
        id: scenario.id,
        title: scenario.title,
        createdAt: scenario.createdAt.toISOString(),
        updatedAt: scenario.updatedAt.toISOString(),
      },
      images: images.map((img) => ({
        id: img.id,
        dataUrl: img.dataUrl,
        createdAt: img.createdAt.toISOString(),
      })),
    };
  },
});
