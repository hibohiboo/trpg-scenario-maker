import { eq, inArray } from 'drizzle-orm';
import { imagesTable } from '../schema';
import type { PgliteDatabase } from 'drizzle-orm/pglite';

/**
 * 画像のデータアクセス層（DI対応）
 * キャラクターとの関連付けはGraphDBで管理
 */
export const createImageRepository = (
  database: PgliteDatabase<Record<string, unknown>>,
) => ({
  /**
   * 画像を作成（IDは自動生成）
   */
  async create(dataUrl: string) {
    const [result] = await database
      .insert(imagesTable)
      .values({ dataUrl })
      .returning({ id: imagesTable.id });
    return result;
  },

  /**
   * IDで画像を取得
   */
  async findById(id: string) {
    const [result] = await database
      .select({
        id: imagesTable.id,
        dataUrl: imagesTable.dataUrl,
        createdAt: imagesTable.createdAt,
      })
      .from(imagesTable)
      .where(eq(imagesTable.id, id));
    return result ?? null;
  },

  /**
   * 複数のIDで画像を取得
   */
  async findByIds(ids: string[]) {
    if (ids.length === 0) return [];

    return database
      .select({
        id: imagesTable.id,
        dataUrl: imagesTable.dataUrl,
        createdAt: imagesTable.createdAt,
      })
      .from(imagesTable)
      .where(inArray(imagesTable.id, ids));
  },

  /**
   * 画像を削除
   */
  async delete(id: string) {
    await database.delete(imagesTable).where(eq(imagesTable.id, id));
  },
});
