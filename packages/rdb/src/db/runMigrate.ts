import { db } from './db';
import migrations from './migrations.json';

export async function runMigrate() {
  // @ts-expect-error drizzleのdialectから直接呼べます
  await db.dialect.migrate(migrations, db.session, {
    migrationsTable: 'drizzle_migrations',
  });
}
