import type { Scenario } from '@trpg-scenario-maker/rdb/schema';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

export const scenarioGraphApi = {
  create: (params: { id: string; title: string }): Promise<Scenario> =>
    graphdbWorkerClient.execute(`
      CREATE (s:Scenario {id: '${params.id}', title: '${params.title}'})
    `),
  save: async () => {
    await graphdbWorkerClient.save();
  },
} as const;
