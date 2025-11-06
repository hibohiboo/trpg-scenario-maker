import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { dbWorkerClient } from './workers/dbWorkerClient';
import { graphdbWorkerClient } from './workers/graphdbWorkerClient';
import './index.css';

// awaitすると初期表示が遅くなる
Promise.allSettled([
  // DBWorkerを初期化（マイグレーション自動実行）
  dbWorkerClient.initialize(),
  // GraphDBWorkerを初期化 ローカルストレージからデータを読み込み
  graphdbWorkerClient.initialize(),
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
