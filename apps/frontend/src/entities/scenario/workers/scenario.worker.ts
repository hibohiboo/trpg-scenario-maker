import {
  createScenario as createScenarioQuery,
  deleteScenario as deleteScenarioQuery,
  getScenarioCount as getScenarioCountQuery,
  getScenarios as getScenariosQuery,
  updateScenario as updateScenarioQuery,
} from '@trpg-scenario-maker/rdb';
import { runMigrate } from '@trpg-scenario-maker/rdb/db/runMigrate';
import type { NewScenario, Scenario } from '@trpg-scenario-maker/rdb/schema';

export type UpdateScenarioData = Pick<NewScenario, 'title'>;

// シナリオWorkerのリクエスト型
export type ScenarioWorkerRequest =
  | { type: 'migrate' }
  | { type: 'getScenarios' }
  | { type: 'getScenarioCount' }
  | { type: 'createScenario'; payload: NewScenario }
  | {
      type: 'updateScenario';
      payload: { id: string; data: UpdateScenarioData };
    }
  | { type: 'deleteScenario'; payload: { id: string } };

// シナリオWorkerのレスポンス型
export type ScenarioWorkerResponse =
  | { type: 'migrate'; success: true }
  | { type: 'getScenarios'; data: Scenario[] }
  | { type: 'getScenarioCount'; data: number }
  | { type: 'createScenario'; data: Scenario }
  | { type: 'updateScenario'; data: Scenario }
  | { type: 'deleteScenario'; success: true }
  | { type: 'error'; error: string; originalType: string };

// Workerメッセージハンドラー
const { self } = globalThis;
self.addEventListener(
  'message',
  async (event: MessageEvent<ScenarioWorkerRequest & { id: number }>) => {
    const { type, id } = event.data;

    try {
      let response: ScenarioWorkerResponse;

      switch (type) {
        case 'migrate': {
          await runMigrate();
          response = { type: 'migrate', success: true };
          break;
        }

        case 'getScenarios': {
          const scenarios = await getScenariosQuery();
          response = { type: 'getScenarios', data: scenarios };
          break;
        }

        case 'getScenarioCount': {
          const count = await getScenarioCountQuery();
          response = { type: 'getScenarioCount', data: count };
          break;
        }

        case 'createScenario': {
          const newScenario = await createScenarioQuery(event.data.payload);
          response = { type: 'createScenario', data: newScenario };
          break;
        }

        case 'updateScenario': {
          const updatedScenario = await updateScenarioQuery(
            event.data.payload.id,
            event.data.payload.data,
          );
          response = { type: 'updateScenario', data: updatedScenario };
          break;
        }

        case 'deleteScenario': {
          await deleteScenarioQuery(event.data.payload.id);
          response = { type: 'deleteScenario', success: true };
          break;
        }

        default:
          throw new Error(`Unknown message type: ${type}`);
      }

      self.postMessage({ id, ...response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      self.postMessage({
        id,
        type: 'error',
        error: errorMessage,
        originalType: type,
      } satisfies ScenarioWorkerResponse & { id: number });
    }
  },
);
