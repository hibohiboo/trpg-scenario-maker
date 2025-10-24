import { db } from '../..';

export async function getScenarioCount() {
  const result = await db.execute('SELECT count(*) as cnt FROM scenarios');
  const [ret] = result.rows;
  return ret?.cnt ?? 0;
}
