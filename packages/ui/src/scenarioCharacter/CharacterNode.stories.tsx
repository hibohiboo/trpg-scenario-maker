import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CharacterNodeData } from '@trpg-scenario-maker/schema';
import { ReactFlowProvider } from '@xyflow/react';
import { CharacterNode } from './CharacterNode';

const meta = {
  title: 'ScenarioCharacter/CharacterNode',
  component: CharacterNode,
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
} satisfies Meta<typeof CharacterNode>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseNodeProps = {
  id: '1',
  type: 'characterNode',
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

export const SimpleCharacter: Story = {
  args: {
    ...baseNodeProps,
    data: {
      name: '勇者',
    } satisfies CharacterNodeData,
  },
};

export const WithRole: Story = {
  args: {
    ...baseNodeProps,
    data: {
      name: '姫',
      role: '依頼人',
    } satisfies CharacterNodeData,
  },
};

export const WithDescription: Story = {
  args: {
    ...baseNodeProps,
    data: {
      name: '魔王',
      role: '敵',
      description: '世界を滅ぼそうとする強大な魔王',
    } satisfies CharacterNodeData,
  },
};

export const FullData: Story = {
  args: {
    ...baseNodeProps,
    data: {
      name: '賢者',
      role: '助言者',
      description: '古代の知識を持つ老賢者。冒険者たちに重要な情報を提供する。',
    } satisfies CharacterNodeData,
  },
};

export const LongName: Story = {
  args: {
    ...baseNodeProps,
    data: {
      name: '伝説の龍を倒した英雄',
      role: '主人公',
    } satisfies CharacterNodeData,
  },
};

export const MultipleRoles: Story = {
  args: {
    ...baseNodeProps,
    data: {
      name: 'エルフの弓使い',
      role: '仲間・戦士',
      description: '森の守護者として長年戦ってきたエルフ',
    } satisfies CharacterNodeData,
  },
};
