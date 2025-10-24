import { readMigrationFiles } from 'drizzle-orm/migrator';
import { writeFile } from 'node:fs/promises';

const migrations = readMigrationFiles({ migrationsFolder: './migrations' });

// 各マイグレーションのSQL文を分割（複数のSQL文が含まれる場合）
const processedMigrations = migrations.map((migration) => ({
  ...migration,
  sql: migration.sql.flatMap((sqlString) => {
    // セミコロンで分割し、空文字列を除外
    return sqlString
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)
      .map((stmt) => stmt + ';');
  }),
}));

await writeFile('./src/db/migrations.json', JSON.stringify(processedMigrations));
console.log('migrations.json generated');
