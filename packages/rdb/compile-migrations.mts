import { readMigrationFiles } from 'drizzle-orm/migrator';
import { writeFile } from 'node:fs/promises';

const migrations = readMigrationFiles({ migrationsFolder: './migrations' });
await writeFile('./src/db/migrations.json', JSON.stringify(migrations));
console.log('migrations.json generated');
