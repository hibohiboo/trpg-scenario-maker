import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import {
  complexFlowConnections,
  complexFlowScenes,
  masterSceneHighlightConnections,
  masterSceneHighlightScenes,
  sampleConnections,
  sampleScenes,
} from './__fixtures__/scenes';
import { SceneFlowCanvas } from './SceneFlowCanvas';

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
    scenes: complexFlowScenes,
    connections: complexFlowConnections,
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
    })),
  },
};

export const MasterSceneHighlight: Story = {
  args: {
    scenes: masterSceneHighlightScenes,
    connections: masterSceneHighlightConnections,
  },
};
