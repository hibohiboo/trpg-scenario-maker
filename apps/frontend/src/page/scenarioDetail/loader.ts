import { store } from '@/app/store';
import {
  readInformationItemsAction,
  readSceneInformationConnectionsAction,
  readInformationConnectionsAction,
  setCurrentScenarioId as setInformationCurrentScenarioId,
  readInformationToSceneByScenarioIdConnectionsAction,
  readSceneInformationConnectionsByScenarioIdConnectionsAction,
} from '@/entities/informationItem';
import { readScenarioAction } from '@/entities/scenario/actions/scenarioActions';
import { readScenarioCharactersAction } from '@/entities/scenarioCharacter';
import {
  readConnectionsAction,
  readScenesAction,
  setCurrentScenarioId,
} from '@/entities/scene';
import { readEventsAction } from '@/entities/sceneEvent';
import type { LoaderFunctionArgs } from 'react-router';

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
  const promises = [
    dispatch(setCurrentScenarioId(scenarioId)),
    dispatch(readConnectionsAction(scenarioId)),
    dispatch(setInformationCurrentScenarioId(scenarioId)),

    // シナリオで使用するキャラクターを読み込み
    dispatch(readScenarioCharactersAction({ scenarioId })),

    // シナリオIDを情報項目のステートに設定し、情報項目を読込
    dispatch(readInformationItemsAction(scenarioId)),
    dispatch(readSceneInformationConnectionsAction(scenarioId)),
    dispatch(readInformationConnectionsAction(scenarioId)),
    dispatch(readInformationToSceneByScenarioIdConnectionsAction(scenarioId)),
    dispatch(
      readSceneInformationConnectionsByScenarioIdConnectionsAction(scenarioId),
    ),
  ];

  const scenes = await dispatch(readScenesAction(scenarioId)).unwrap();
  await Promise.all([
    ...scenes.map((scene) => dispatch(readEventsAction(scene.id))),
    ...promises,
  ]);
  return existingScenario;
};
