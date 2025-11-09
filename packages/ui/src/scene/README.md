# Scene Components

TRPGシナリオのシーンフロー管理コンポーネント群です。

## ディレクトリ構成

```
scene/
├── canvas/                    # SceneFlowCanvasの分割コンポーネント
│   ├── CanvasToolbar.tsx     # ツールバー（操作説明・自動整列ボタン）
│   ├── FlowCanvas.tsx        # ReactFlowラッパーコンポーネント
│   ├── SceneDetailSidebar.tsx # シーン詳細サイドバー
│   ├── flowUtils.ts          # レイアウト計算・Node変換ユーティリティ
│   └── index.ts              # エクスポート定義
├── __fixtures__/             # テストデータ・Storybookフィクスチャ
│   └── scenes.ts             # サンプルシーンデータ
├── SceneFlowCanvas.tsx       # メインコンポーネント
├── SceneFlowCanvas.stories.tsx # Storybookストーリー
└── types.ts                  # 型定義

```

## コンポーネント概要

### SceneFlowCanvas

シーンフロー全体を管理するメインコンポーネントです。

**Props:**
- `scenes: Scene[]` - シーンの配列
- `connections: SceneConnection[]` - シーン間の接続の配列
- `onNodesChange?: (nodes: Scene[]) => void` - ノード変更時のコールバック
- `onConnectionAdd?: (connection: Omit<SceneConnection, 'id'>) => void` - 接続追加時のコールバック
- `onConnectionDelete?: (id: string) => void` - 接続削除時のコールバック

**機能:**
- シーンのドラッグ&ドロップによる位置変更
- シーン間の接続の作成・削除
- 自動レイアウト（縦方向・横方向）
- シーン詳細の表示（サイドバー）

### canvas/CanvasToolbar

操作説明と自動整列ボタンを含むツールバーコンポーネントです。

**Props:**
- `onLayout: (direction: 'TB' | 'LR') => void` - レイアウト実行時のコールバック

### canvas/FlowCanvas

ReactFlowをラップしたキャンバスコンポーネントです。ハンドルのスタイリングやミニマップなどの機能を含みます。

**Props:**
- `nodes: Node[]` - ReactFlowのノード配列
- `edges: Edge[]` - ReactFlowのエッジ配列
- `onNodesChange: OnNodesChange` - ノード変更ハンドラ
- `onEdgesChange: OnEdgesChange` - エッジ変更ハンドラ
- `onConnect: OnConnect` - 接続ハンドラ
- `onNodeClick: (event: React.MouseEvent, node: Node) => void` - ノードクリックハンドラ

### canvas/SceneDetailSidebar

選択されたシーンの詳細を表示するサイドバーコンポーネントです。

**Props:**
- `scene: Scene | null` - 表示するシーン（nullの場合は非表示）
- `onClose: () => void` - 閉じるボタンクリック時のコールバック

### canvas/flowUtils

レイアウト計算とNode変換のユーティリティ関数です。

**関数:**
- `getLayoutedElements(nodes, edges, direction)` - Dagreを使用した自動レイアウト計算
- `scenesToNodes(scenes, existingNodes?)` - SceneデータをReactFlowのNode形式に変換

## 使用例

```tsx
import { SceneFlowCanvas } from './scene/SceneFlowCanvas';
import type { Scene, SceneConnection } from './scene/types';

const scenes: Scene[] = [
  {
    id: '1',
    title: 'オープニング',
    description: '冒険者たちが酒場で出会うシーン',
    isMasterScene: true,
  },
  {
    id: '2',
    title: '古城への道',
    description: '険しい山道を登り、古城へ向かう',
    isMasterScene: false,
  },
];

const connections: SceneConnection[] = [
  { id: '1-2', source: '1', target: '2' },
];

function App() {
  return (
    <SceneFlowCanvas
      scenes={scenes}
      connections={connections}
      onNodesChange={(updatedScenes) => console.log(updatedScenes)}
      onConnectionAdd={(connection) => console.log('Added:', connection)}
      onConnectionDelete={(id) => console.log('Deleted:', id)}
    />
  );
}
```

## 型定義

### Scene

```typescript
interface Scene {
  id: string;
  title: string;
  description: string;
  isMasterScene: boolean;
}
```

### SceneConnection

```typescript
interface SceneConnection {
  id: string;
  source: string;  // シーンID
  target: string;  // シーンID
}
```

## 開発ガイド

### Storybook

Storybookでコンポーネントの動作を確認できます：

```bash
npm run storybook
```

ストーリー一覧：
- `Default` - 基本的なシーンフロー
- `SingleScene` - 単一シーン
- `TwoScenes` - 2つのシーン
- `Empty` - 空の状態
- `ComplexFlow` - 複雑なフロー（分岐含む）
- `WithoutOrder` - 順序なしフロー
- `ManyScenes` - 多数のシーン
- `MasterSceneHighlight` - マスターシーンのハイライト表示

### テストデータ

`__fixtures__/scenes.ts`に各種テストデータが定義されています：
- `sampleScenes` / `sampleConnections` - 基本的なサンプルデータ
- `complexFlowScenes` / `complexFlowConnections` - 複雑なフローのサンプル
- `masterSceneHighlightScenes` / `masterSceneHighlightConnections` - マスターシーンのサンプル

## 技術スタック

- **React Flow** - ノードベースのフロー図作成ライブラリ
- **Dagre** - グラフレイアウトアルゴリズム
- **ReactMarkdown** - Markdown表示（シーン詳細）
- **remark-gfm** - GitHub Flavored Markdownサポート
- **react-icons** - アイコン表示

## スタイリング

- **Tailwind CSS** - ユーティリティファーストCSS
- **カスタムスタイル** - ReactFlowハンドルのカスタマイズ

マスターシーンは緑色（`#dcfce7` 背景、`#16a34a` 境界線）でハイライト表示されます。
