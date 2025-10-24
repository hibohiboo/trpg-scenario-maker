import { eq } from 'drizzle-orm';
import { db } from '../..';
import { scenariosTable } from '../../schema';

export async function updateScenario(id: string, data: { title: string }) {
  await db
    .update(scenariosTable)
    .set({ title: data.title, updatedAt: new Date() })
    .where(eq(scenariosTable.id, id));
}
