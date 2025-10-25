import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { scenarioWorkerClient } from './entities/scenario/workers/scenarioWorkerClient';

import './index.css';

// WebWorkerを初期化してマイグレーション実行
await scenarioWorkerClient.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
