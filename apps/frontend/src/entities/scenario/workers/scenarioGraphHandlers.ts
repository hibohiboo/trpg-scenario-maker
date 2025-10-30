import { scenarioGraphRepository } from '@trpg-scenario-maker/graphdb';

/**
 * シナリオのグラフDB操作ハンドラー
 */
export const scenarioGraphHandlers = [
  {
    type: 'scenario:graph:create',
    handler: async (payload: unknown) => {
      const params = payload as { id: string; title: string };
      const result = await scenarioGraphRepository.create(params);
      return { data: result };
    },
  },
  {
    type: 'scenario:graph:update',
    handler: async (payload: unknown) => {
      const params = payload as { id: string; title: string };
      const result = await scenarioGraphRepository.update(params);
      return { data: result };
    },
  },
  {
    type: 'scenario:graph:delete',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      await scenarioGraphRepository.delete(id);
      return { success: true };
    },
  },
  {
    type: 'scenario:graph:findAll',
    handler: async () => {
      const result = await scenarioGraphRepository.findAll();
      return { data: result };
    },
  },
] as const;

type ScenarioGraphHandler = (typeof scenarioGraphHandlers)[number];

export type ScenarioGraphHandlerMap = {
  [H in ScenarioGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
