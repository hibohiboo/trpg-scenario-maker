import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactFlowProvider } from '@xyflow/react';
import type { Scene } from '../types';
import { SceneNode } from './SceneNode';

const meta = {
  title: 'Scene/Canvas/SceneNode',
  component: SceneNode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div style={{ width: '400px', height: '200px' }}>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
} satisfies Meta<typeof SceneNode>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseNodeProps = {
  id: '1',
  type: 'sceneNode',
  selected: false,
  dragging: false,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
  zIndex: 0,
  data: {},
  selectable: false,
  deletable: false,
  draggable: false,
};

export const SimpleScene: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '1',
      title: 'オープニング',
      description: '冒険者たちが酒場で出会うシーン',
      isMasterScene: false,
    } satisfies Scene,
  },
};

export const MasterScene: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '1',
      title: 'スタート',
      description: 'マスターシーン',
      isMasterScene: true,
    } satisfies Scene,
  },
};

export const WithSingleEvent: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '1',
      title: 'オープニング',
      description: '冒険者たちが酒場で出会うシーン',
      isMasterScene: false,
      events: [
        {
          id: 'e1',
          type: 'start',
          content: 'シーン開始',
          sortOrder: 0,
        },
      ],
    } satisfies Scene,
  },
};

export const WithMultipleEvents: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '1',
      title: 'オープニング',
      description: '冒険者たちが酒場で出会うシーン',
      isMasterScene: false,
      events: [
        {
          id: 'e1',
          type: 'start',
          content: 'シーン開始',
          sortOrder: 0,
        },
        {
          id: 'e2',
          type: 'conversation',
          content: 'マスターとの会話',
          sortOrder: 1,
        },
        {
          id: 'e3',
          type: 'choice',
          content: '依頼を受けるか選択',
          sortOrder: 2,
        },
      ],
    } satisfies Scene,
  },
};

export const BattleScene: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '4',
      title: 'ボス戦',
      description: '古城の最上階でドラゴンと戦う',
      isMasterScene: false,
      events: [
        {
          id: 'e7',
          type: 'battle',
          content: 'ドラゴンとの戦闘',
          sortOrder: 0,
        },
      ],
    } satisfies Scene,
  },
};

export const TreasureAndTrapScene: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '3',
      title: '古城の入口',
      description: '荘厳な古城の門をくぐる',
      isMasterScene: false,
      events: [
        {
          id: 'e5',
          type: 'puzzle',
          content: '門の謎解き',
          sortOrder: 0,
        },
        {
          id: 'e6',
          type: 'treasure',
          content: '小さな宝箱発見',
          sortOrder: 1,
        },
        {
          id: 'e7',
          type: 'trap',
          content: '落とし穴',
          sortOrder: 2,
        },
      ],
    } satisfies Scene,
  },
};

export const EndingScene: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '5',
      title: 'エンディング',
      description: '冒険の終わりと報酬',
      isMasterScene: false,
      events: [
        {
          id: 'e8',
          type: 'rest',
          content: '酒場で祝杯',
          sortOrder: 0,
        },
        {
          id: 'e9',
          type: 'ending',
          content: 'エンディング',
          sortOrder: 1,
        },
      ],
    } satisfies Scene,
  },
};

export const AllEventTypes: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '1',
      title: 'イベント満載',
      description: '全種類のイベントが含まれるシーン',
      isMasterScene: false,
      events: [
        { id: 'e1', type: 'start', content: '開始', sortOrder: 0 },
        { id: 'e2', type: 'conversation', content: '会話', sortOrder: 1 },
        { id: 'e3', type: 'choice', content: '選択', sortOrder: 2 },
        { id: 'e4', type: 'battle', content: '戦闘', sortOrder: 3 },
        { id: 'e5', type: 'treasure', content: '宝箱', sortOrder: 4 },
        { id: 'e6', type: 'trap', content: '罠', sortOrder: 5 },
        { id: 'e7', type: 'puzzle', content: '謎解き', sortOrder: 6 },
        { id: 'e8', type: 'rest', content: '休息', sortOrder: 7 },
        { id: 'e9', type: 'ending', content: '終了', sortOrder: 8 },
      ],
    } satisfies Scene,
  },
};

export const LongTitle: Story = {
  args: {
    ...baseNodeProps,
    data: {
      id: '1',
      title: '非常に長いタイトルのシーンでレイアウトをテストする',
      description: '長いタイトルの表示確認',
      isMasterScene: false,
      events: [
        {
          id: 'e1',
          type: 'conversation',
          content: '会話イベント',
          sortOrder: 0,
        },
      ],
    } satisfies Scene,
  },
};
