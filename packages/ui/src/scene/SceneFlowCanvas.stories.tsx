import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { SceneFlowCanvas } from './SceneFlowCanvas';
import type { Scene, SceneConnection } from './types';

const meta = {
  title: 'Scene/SceneFlowCanvas',
  component: SceneFlowCanvas,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    scenes: {
      description: 'シーンの配列',
    },
    connections: {
      description: 'シーン間の接続の配列',
    },
    onNodesChange: {
      description: 'ノード変更時のコールバック',
    },
    onConnectionAdd: {
      description: '接続追加時のコールバック',
    },
    onConnectionDelete: {
      description: '接続削除時のコールバック',
    },
  },
  args: {
    onNodesChange: fn(),
    onConnectionAdd: fn(),
    onConnectionDelete: fn(),
  },
} satisfies Meta<typeof SceneFlowCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleScenes: Scene[] = [
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
  {
    id: '3',
    title: '古城の入口',
    description: '荘厳な古城の門をくぐる',
    isMasterScene: false,
  },
  {
    id: '4',
    title: 'ボス戦',
    description: '古城の最上階でドラゴンと戦う',
    isMasterScene: false,
  },
  {
    id: '5',
    title: 'エンディング',
    description: '冒険の終わりと報酬',
    isMasterScene: false,
  },
];

const sampleConnections: SceneConnection[] = [
  { id: '1-2', source: '1', target: '2', order: 1 },
  { id: '2-3', source: '2', target: '3', order: 2 },
  { id: '3-4', source: '3', target: '4', order: 3 },
  { id: '4-5', source: '4', target: '5', order: 4 },
];

export const Default: Story = {
  args: {
    scenes: sampleScenes,
    connections: sampleConnections,
  },
};

export const SingleScene: Story = {
  args: {
    scenes: [sampleScenes[0]],
    connections: [],
  },
};

export const TwoScenes: Story = {
  args: {
    scenes: [sampleScenes[0], sampleScenes[1]],
    connections: [sampleConnections[0]],
  },
};

export const Empty: Story = {
  args: {
    scenes: [],
    connections: [],
  },
};

export const ComplexFlow: Story = {
  args: {
    scenes: [
      ...sampleScenes,
      {
        id: '6',
        title: '隠し通路',
        description: '古城の隠された通路を発見',
        isMasterScene: false,
      },
      {
        id: '7',
        title: '宝物庫',
        description: '隠された宝物を発見',
        isMasterScene: false,
      },
    ],
    connections: [
      ...sampleConnections,
      { id: '3-6', source: '3', target: '6', order: 3 },
      { id: '6-7', source: '6', target: '7', order: 4 },
      { id: '7-5', source: '7', target: '5', order: 5 },
    ],
  },
};

export const WithoutOrder: Story = {
  args: {
    scenes: sampleScenes.slice(0, 3),
    connections: [
      { id: '1-2', source: '1', target: '2' },
      { id: '2-3', source: '2', target: '3' },
    ],
  },
};

export const ManyScenes: Story = {
  args: {
    scenes: Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `シーン ${i + 1}`,
      description: `シーン ${i + 1} の説明`,
      isMasterScene: i === 0,
    })),
    connections: Array.from({ length: 9 }, (_, i) => ({
      id: `${i + 1}-${i + 2}`,
      source: `${i + 1}`,
      target: `${i + 2}`,
      order: i + 1,
    })),
  },
};

export const MasterSceneHighlight: Story = {
  args: {
    scenes: [
      {
        id: '1',
        title: 'スタート（マスターシーン）',
        description: 'マスターシーンは緑色で表示されます',
        isMasterScene: true,
      },
      {
        id: '2',
        title: '通常シーン1',
        description: '通常のシーン',
        isMasterScene: false,
      },
      {
        id: '3',
        title: '通常シーン2',
        description: '通常のシーン',
        isMasterScene: false,
      },
    ],
    connections: [
      { id: '1-2', source: '1', target: '2', order: 1 },
      { id: '1-3', source: '1', target: '3', order: 2 },
    ],
  },
};
