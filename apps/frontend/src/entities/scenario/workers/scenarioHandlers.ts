import {
  createScenario as createScenarioQuery,
  deleteScenario as deleteScenarioQuery,
  getScenarioCount as getScenarioCountQuery,
  getScenarios as getScenariosQuery,
  updateScenario as updateScenarioQuery,
} from '@trpg-scenario-maker/rdb';
import type { NewScenario, Scenario } from '@trpg-scenario-maker/rdb/schema';

export type UpdateScenarioData = Pick<NewScenario, 'title'>;

// ===== シナリオ操作ハンドラー =====
// 循環依存を避けるため、ハンドラーを配列形式でエクスポート
export const scenarioHandlers = [
  {
    type: 'scenario:getList',
    handler: async () => {
      const scenarios = await getScenariosQuery();
      return { data: scenarios };
    },
  },
  {
    type: 'scenario:getCount',
    handler: async () => {
      const count = await getScenarioCountQuery();
      return { data: count };
    },
  },
  {
    type: 'scenario:create',
    handler: async (payload: unknown) => {
      const newScenario = await createScenarioQuery(payload as NewScenario);
      return { data: newScenario };
    },
  },
  {
    type: 'scenario:update',
    handler: async (payload: unknown) => {
      const { id, data } = payload as { id: string; data: UpdateScenarioData };
      const updatedScenario = await updateScenarioQuery(id, data);
      return { data: updatedScenario };
    },
  },
  {
    type: 'scenario:delete',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      await deleteScenarioQuery(id);
      return { success: true };
    },
  },
];

// 型定義のエクスポート（クライアント側で使用）
export interface ScenarioHandlers {
  'scenario:getList': {
    request: void;
    response: Scenario[];
  };
  'scenario:getCount': {
    request: void;
    response: number;
  };
  'scenario:create': {
    request: NewScenario;
    response: Scenario;
  };
  'scenario:update': {
    request: { id: string; data: UpdateScenarioData };
    response: Scenario;
  };
  'scenario:delete': {
    request: { id: string };
    response: void;
  };
}
