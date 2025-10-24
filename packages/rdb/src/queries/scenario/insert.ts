import { db } from '../..';
import { type InsertScenario, scenariosTable } from '../../schema';

export async function createScenario(data: InsertScenario) {
  await db.insert(scenariosTable).values(data);
}
