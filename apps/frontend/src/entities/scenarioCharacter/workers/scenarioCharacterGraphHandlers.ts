import { scenarioCharacterRepository } from '@trpg-scenario-maker/graphdb';
import { parseToScenarioCharacterList } from '@trpg-scenario-maker/schema';

/**
 * シナリオ×キャラクター関係のグラフDB操作ハンドラー
 */
export const scenarioCharacterGraphHandlers = [
  {
    type: 'scenarioCharacter:graph:addToScenario',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        characterId: string;
        role?: string;
      };
      const result =
        await scenarioCharacterRepository.addCharacterToScenario(params);
      const [data] = parseToScenarioCharacterList(result);

      if (!data) {
        throw new Error(
          'Failed to add character to scenario: No result returned from database',
        );
      }

      return { data };
    },
  },
  {
    type: 'scenarioCharacter:graph:removeFromScenario',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        characterId: string;
      };
      await scenarioCharacterRepository.removeCharacterFromScenario(params);
      return { success: true };
    },
  },
  {
    type: 'scenarioCharacter:graph:updateRole',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        characterId: string;
        role: string;
      };
      const result =
        await scenarioCharacterRepository.updateCharacterRole(params);
      const [data] = parseToScenarioCharacterList(result);

      if (!data) {
        throw new Error(
          'Failed to update character role: No result returned from database',
        );
      }

      return { data };
    },
  },
  {
    type: 'scenarioCharacter:graph:getByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } = payload as { scenarioId: string };
      const result =
        await scenarioCharacterRepository.findCharactersByScenarioId(
          scenarioId,
        );
      const data = parseToScenarioCharacterList(result);
      return { data };
    },
  },
] as const;

type ScenarioCharacterGraphHandler =
  (typeof scenarioCharacterGraphHandlers)[number];

export type ScenarioCharacterGraphHandlerMap = {
  [H in ScenarioCharacterGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
