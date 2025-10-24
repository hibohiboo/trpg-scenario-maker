import { desc } from 'drizzle-orm';
import { db } from '../..';
import { scenariosTable } from '../../schema';

export async function getScenarios() {
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
      createdAt: scenariosTable.createdAt,
      updatedAt: scenariosTable.updatedAt,
    })
    .from(scenariosTable)
    .orderBy(desc(scenariosTable.updatedAt));
}
