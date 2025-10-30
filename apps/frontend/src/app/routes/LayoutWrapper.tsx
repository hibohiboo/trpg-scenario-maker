import { Layout } from '@trpg-scenario-maker/ui';
import { Outlet, useLocation } from 'react-router';

const navigationItems = [
  { path: '/', label: 'シナリオ一覧' },
  { path: '/characters', label: 'キャラクター管理' },
];

export function LayoutWrapper() {
  const location = useLocation();
  return (
    <Layout navigationItems={navigationItems} currentPath={location.pathname}>
      <Outlet />
    </Layout>
  );
}
