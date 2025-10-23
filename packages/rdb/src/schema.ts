import { pgSchema, uuid, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const mySchema = pgSchema('trpg-scenario-maker');

export const scenariosTable = mySchema.table('scenarios', {
  id: uuid().primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
