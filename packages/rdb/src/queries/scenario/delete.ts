import { eq } from 'drizzle-orm';
import { db } from '../..';
import { scenariosTable } from '../../schema';

export async function deleteScenario(id: string) {
  await db.delete(scenariosTable).where(eq(scenariosTable.id, id));
}
