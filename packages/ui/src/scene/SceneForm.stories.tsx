import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SceneForm } from './SceneForm';
import type { Scene, SceneConnection } from './types';

const meta = {
  title: 'Scene/SceneForm',
  component: SceneForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    scene: {
      description: '編集するシーンデータ（新規作成の場合はundefined）',
    },
    scenes: {
      description: '全シーンのリスト（接続情報の表示に使用）',
    },
    connections: {
      description: 'シーン間の接続情報',
    },
    onSubmit: {
      description: '送信時のコールバック',
    },
    onCancel: {
      description: 'キャンセル時のコールバック',
    },
    onConnectionDelete: {
      description: '接続削除時のコールバック',
    },
    onConnectionAdd: {
      description: '接続追加時のコールバック',
    },
  },
  args: {
    onSubmit: fn(),
    onCancel: fn(),
    onConnectionDelete: fn(),
    onConnectionAdd: fn(),
  },
} satisfies Meta<typeof SceneForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleScene: Scene = {
  id: '1',
  title: 'オープニング',
  description: '冒険者たちが酒場で出会うシーン',
  isMasterScene: true,
};

const sampleScenes: Scene[] = [
  sampleScene,
  {
    id: '2',
    title: '古城への道',
    description: '険しい山道を登り、古城へ向かう',
    isMasterScene: false,
  },
  {
    id: '3',
    title: 'ボス戦',
    description: '古城の最上階で待ち構えるドラゴンとの激しい戦闘',
    isMasterScene: false,
  },
  {
    id: '4',
    title: '宝物庫',
    description: '古城の地下にある宝物庫を探索',
    isMasterScene: false,
  },
];

const sampleConnections: SceneConnection[] = [
  { id: '1-2', source: '1', target: '2' },
  { id: '2-3', source: '2', target: '3' },
  { id: '2-4', source: '2', target: '4' },
];

export const Create: Story = {
  args: {
    scene: undefined,
  },
};

export const Edit: Story = {
  args: {
    scene: sampleScene,
  },
};

export const EditNonMasterScene: Story = {
  args: {
    scene: {
      id: '2',
      title: '古城への道',
      description: '険しい山道を登り、古城へ向かう',
      isMasterScene: false,
    },
  },
};

export const WithoutCancelButton: Story = {
  args: {
    scene: undefined,
    onCancel: undefined,
  },
};

export const LongDescription: Story = {
  args: {
    scene: {
      id: '3',
      title: 'ボス戦',
      description:
        '古城の最上階で待ち構えるドラゴンとの激しい戦闘。冒険者たちは協力してドラゴンを倒さなければならない。ドラゴンは炎のブレスと強力な爪攻撃を持ち、戦闘は困難を極める。しかし、冒険者たちの勇気と絆が勝利への鍵となるだろう。',
      isMasterScene: false,
    },
  },
};

export const InModal: Story = {
  render: () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4">新しいシーンを作成</h2>
        <SceneForm onSubmit={fn()} onCancel={fn()} />
      </div>
    </div>
  ),
  args: {} as never,
};

export const WithConnections: Story = {
  args: {
    scene: sampleScenes[1], // "古城への道"
    scenes: sampleScenes,
    connections: sampleConnections,
  },
};

export const WithPreviousSceneOnly: Story = {
  args: {
    scene: sampleScenes[0], // "オープニング" - 次のシーンのみ
    scenes: sampleScenes,
    connections: sampleConnections,
  },
};

export const WithNextScenesOnly: Story = {
  args: {
    scene: sampleScenes[2], // "ボス戦" - 前のシーンのみ
    scenes: sampleScenes,
    connections: sampleConnections,
  },
};

export const WithMultipleConnections: Story = {
  args: {
    scene: sampleScenes[1], // "古城への道" - 前後に複数の接続
    scenes: sampleScenes,
    connections: [
      ...sampleConnections,
      { id: '3-2', source: '3', target: '2' },
      { id: '4-2', source: '4', target: '2' },
    ],
  },
};
