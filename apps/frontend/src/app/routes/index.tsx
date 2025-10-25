import { createBrowserRouter } from 'react-router';
import { ScenarioPage } from '@/page/scenario';
import { ScenarioDetailPage } from '@/page/scenarioDetail';
import { readScenarioAction } from '@/entities/scenario/actions/scenarioActions';
import { store } from '../store';

export const createRouter = (_: { dispatch: AppDispatch }) =>
  createBrowserRouter(
    [
      {
        path: '/',
        children: [
          {
            path: '',
            element: <ScenarioPage />,
          },
          {
            path: 'scenario',
            children: [
              {
                path: ':id',
                element: <ScenarioDetailPage />,
                loader: async ({ params }) => {
                  let state = store.getState();
                  if (state.scenario.scenarios.length === 0) {
                    await store.dispatch(readScenarioAction());
                    state = store.getState();
                  }
                  const existingScenario = state.scenario.scenarios.find(
                    (s) => s.id === params.id,
                  );
                  if (!existingScenario) {
                    throw new Error('シナリオが見つかりません');
                  }
                  return existingScenario;
                },
              },
            ],
          },
        ],
      },
    ],
    { basename: BASE_PATH },
  );
