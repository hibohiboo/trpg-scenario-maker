import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { dbWorkerClient } from './workers/dbWorkerClient';

import './index.css';

// WebWorkerを初期化してマイグレーション実行
await dbWorkerClient.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
