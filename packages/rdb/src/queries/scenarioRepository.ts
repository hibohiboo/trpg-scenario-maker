import { eq, desc } from 'drizzle-orm';
import { db } from '..';
import { scenariosTable, type NewScenario } from '../schema';

/**
 * シナリオのデータアクセス層
 */
export const scenarioRepository = {
  /**
   * シナリオの総数を取得
   */
  async count() {
    const result = await db.execute<{ cnt: number }>(
      'SELECT count(*) as cnt FROM scenarios',
    );
    const [ret] = result.rows;
    return ret?.cnt ?? 0;
  },

  /**
   * 全シナリオを取得（更新日時の降順）
   */
  async findAll() {
    return db
      .select({
        id: scenariosTable.id,
        title: scenariosTable.title,
        createdAt: scenariosTable.createdAt,
        updatedAt: scenariosTable.updatedAt,
      })
      .from(scenariosTable)
      .orderBy(desc(scenariosTable.updatedAt));
  },

  /**
   * シナリオを作成
   */
  async create(data: NewScenario) {
    const [result] = await db.insert(scenariosTable).values(data).returning();
    return result;
  },

  /**
   * シナリオを更新
   */
  async update(id: string, data: { title: string }) {
    const [result] = await db
      .update(scenariosTable)
      .set({ title: data.title, updatedAt: new Date() })
      .where(eq(scenariosTable.id, id))
      .returning();
    return result;
  },

  /**
   * シナリオを削除
   */
  async delete(id: string) {
    await db.delete(scenariosTable).where(eq(scenariosTable.id, id));
  },
} as const;
