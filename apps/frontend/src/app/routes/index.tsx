import { Layout } from '@trpg-scenario-maker/ui';
import { createBrowserRouter, Outlet } from 'react-router';
import { ScenarioPage } from '@/page/scenario';
import { ScenarioDetailPage } from '@/page/scenarioDetail';
import { scenarioDetailLoader } from '@/page/scenarioDetail/loader';

export const createRouter = (_: { dispatch: AppDispatch }) =>
  createBrowserRouter(
    [
      {
        path: '/',
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
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
        ],
      },
    ],
    { basename: BASE_PATH },
  );
