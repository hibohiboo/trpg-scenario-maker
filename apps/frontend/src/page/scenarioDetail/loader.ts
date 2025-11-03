import type { LoaderFunctionArgs } from 'react-router';
import { store } from '@/app/store';
import {
  readInformationItemsAction,
  readSceneInformationConnectionsAction,
  readInformationConnectionsAction,
  readInformationToSceneConnectionsAction,
  setCurrentScenarioId as setInformationCurrentScenarioId,
} from '@/entities/informationItem';
import { readScenarioAction } from '@/entities/scenario/actions/scenarioActions';
import { readScenarioCharactersAction } from '@/entities/scenarioCharacter';
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

  const scenarioId = existingScenario.id;
  dispatch(setCurrentScenarioId(scenarioId));
  dispatch(readConnectionsAction(scenarioId));
  dispatch(setInformationCurrentScenarioId(scenarioId));

  // シナリオで使用するキャラクターを読み込み
  dispatch(readScenarioCharactersAction({ scenarioId }));

  // シナリオIDを情報項目のステートに設定し、情報項目を読込
  dispatch(readInformationItemsAction(scenarioId));
  dispatch(readSceneInformationConnectionsAction(scenarioId));
  dispatch(readInformationConnectionsAction(scenarioId));
  dispatch(readInformationToSceneConnectionsAction(scenarioId));
  const scenes = await dispatch(readScenesAction(scenarioId)).unwrap();
  await Promise.all(
    scenes.map((scene) => dispatch(readEventsAction(scene.id))),
  );
  return existingScenario;
};
