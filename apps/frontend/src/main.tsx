import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { dbWorkerClient } from './workers/dbWorkerClient';
import { graphdbWorkerClient } from './workers/graphdbWorkerClient';
import './index.css';

// DBWorkerを初期化（マイグレーション自動実行）
await dbWorkerClient.initialize();

// GraphDBWorkerを初期化
await graphdbWorkerClient.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
