import { db } from '../..';
import { type InsertScenario, scenariosTable } from '../../schema';

export async function createScenario(data: InsertScenario) {
  const [result] = await db.insert(scenariosTable).values(data).returning();
  return result;
}
