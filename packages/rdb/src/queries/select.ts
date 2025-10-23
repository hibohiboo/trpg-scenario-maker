import { db } from '../db/db';
import { scenariosTable } from '../schema';

export async function getScenarios() {
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
      updatedAt: scenariosTable.updatedAt,
    })
    .from(scenariosTable);
}
