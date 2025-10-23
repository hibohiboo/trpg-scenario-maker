import { runMigrate } from '@trpg-scenario-maker/rdb/db/runMigrate';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

import './index.css';

await runMigrate();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
