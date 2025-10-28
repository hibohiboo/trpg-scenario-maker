import type { LoaderFunctionArgs } from 'react-router';
import { store } from '@/app/store';
import { scenarioGraphApi } from '@/entities/scenario';
import { readScenarioAction } from '@/entities/scenario/actions/scenarioActions';
import {
  readConnectionsAction,
  readScenesAction,
  setCurrentScenarioId,
} from '@/entities/scene';
import { readEventsAction } from '@/entities/sceneEvent';

const { getState, dispatch } = store;

export const scenarioDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  let state = getState();

  if (state.scenario.scenarios.length === 0) {
    await dispatch(readScenarioAction());
    state = getState();
  }
  const existingScenario = state.scenario.scenarios.find(
    (s) => s.id === params.id,
  );
  if (!existingScenario) {
    throw new Error('シナリオが見つかりません');
  }
  scenarioGraphApi.create(existingScenario); // RDBから読み込んだシナリオをグラフDBにも反映(初回用)
  const scenarioId = existingScenario.id;
  dispatch(setCurrentScenarioId(scenarioId));
  dispatch(readConnectionsAction(scenarioId));
  const scenes = await dispatch(readScenesAction(scenarioId)).unwrap();
  await Promise.all(
    scenes.map((scene) => dispatch(readEventsAction(scene.id))),
  );
  return existingScenario;
};
