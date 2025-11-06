import { scenarioRepository } from '@trpg-scenario-maker/rdb';
import {
  parseCreateScenarioPayload,
  parseUpdateScenarioPayload,
  parseScenarioIdPayload,
  parseScenarioList,
  parseScenario,
  parseScenarioCount,
} from '@trpg-scenario-maker/schema';

// ===== シナリオ操作ハンドラー =====
// 循環依存を避けるため、ハンドラーを配列形式でエクスポート
export const scenarioHandlers = [
  {
    type: 'scenario:getList',
    handler: async () => {
      const scenarios = await scenarioRepository.findAll();
      const data = parseScenarioList(scenarios);
      return { data };
    },
  },
  {
    type: 'scenario:getCount',
    handler: async () => {
      const count = await scenarioRepository.count();
      const data = parseScenarioCount(count);
      return { data };
    },
  },
  {
    type: 'scenario:create',
    handler: async (payload: unknown) => {
      const { title } = parseCreateScenarioPayload(payload);
      const newScenario = await scenarioRepository.create({
        id: crypto.randomUUID(),
        title,
      });
      const data = parseScenario(newScenario);
      return { data };
    },
  },
  {
    type: 'scenario:update',
    handler: async (payload: unknown) => {
      const { id, data: updateData } = parseUpdateScenarioPayload(payload);
      const updatedScenario = await scenarioRepository.update(id, updateData);
      const data = parseScenario(updatedScenario);
      return { data };
    },
  },
  {
    type: 'scenario:delete',
    handler: async (payload: unknown) => {
      const { id } = parseScenarioIdPayload(payload);
      await scenarioRepository.delete(id);
      return { success: true };
    },
  },
] as const;
type ScenarioRdbHandler = (typeof scenarioHandlers)[number];

export type ScenarioRdbHandlerMap = {
  [H in ScenarioRdbHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{
    data: infer D;
  }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
