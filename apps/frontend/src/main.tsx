import { runExample } from '@trpg-scenario-maker/graphdb';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { dbWorkerClient } from './workers/dbWorkerClient';

import './index.css';

runExample();
// DBWorkerを初期化（マイグレーション自動実行）
await dbWorkerClient.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
