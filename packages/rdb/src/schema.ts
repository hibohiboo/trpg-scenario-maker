import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const scenariosTable = pgTable('scenarios', {
  id: uuid().primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertScenario = typeof scenariosTable.$inferInsert;
