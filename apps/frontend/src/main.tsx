import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { scenarioWorkerClient } from './entities/scenario/workers/scenarioWorkerClient';
import { dbMigrationWorkerClient } from './shared/workers/dbMigrationWorkerClient';

import './index.css';

// 1. DB初期化Workerでマイグレーション実行
await dbMigrationWorkerClient.initialize();

// 2. シナリオWorkerを初期化
await scenarioWorkerClient.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
