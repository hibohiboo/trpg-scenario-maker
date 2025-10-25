import { db } from '../..';
import { type NewScenario, scenariosTable } from '../../schema';

export async function createScenario(data: NewScenario) {
  const [result] = await db.insert(scenariosTable).values(data).returning();
  return result;
}
