import { createBrowserRouter } from 'react-router';
import { CharacterRelationshipPage } from '@/page/character';
import { ScenarioPage } from '@/page/scenario';
import { ScenarioDetailPage } from '@/page/scenarioDetail';
import { scenarioDetailLoader } from '@/page/scenarioDetail/loader';
import { LayoutWrapper } from './LayoutWrapper';

export const createRouter = (_: { dispatch: AppDispatch }) =>
  createBrowserRouter(
    [
      {
        path: '/',
        element: <LayoutWrapper />,
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
                loader: scenarioDetailLoader,
              },
            ],
          },
          {
            path: 'characters',
            element: <CharacterRelationshipPage />,
          },
        ],
      },
    ],
    { basename: BASE_PATH },
  );
