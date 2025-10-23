import { db } from '../db/db';
import { type InsertScenario, scenariosTable } from '../schema';

export async function createScenario(data: InsertScenario) {
  await db.insert(scenariosTable).values(data);
}
