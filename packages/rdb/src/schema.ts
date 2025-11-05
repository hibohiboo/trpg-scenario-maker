import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const scenariosTable = pgTable('scenarios', {
  id: uuid().primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type NewScenario = typeof scenariosTable.$inferInsert;
export type Scenario = typeof scenariosTable.$inferSelect;

/**
 * 画像テーブル
 * キャラクターとの関連付けはGraphDBで管理
 */
export const imagesTable = pgTable('images', {
  id: uuid().primaryKey().defaultRandom(),
  dataUrl: text('data_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type NewImage = typeof imagesTable.$inferInsert;
export type Image = typeof imagesTable.$inferSelect;
