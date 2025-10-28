import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ScenarioList } from './ScenarioList';
import type { Scenario } from './types';

const meta = {
  title: 'Scenario/ScenarioList',
  component: ScenarioList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    scenarios: {
      description: 'シナリオのリスト',
    },
    onCreateNew: {
      description: '新規作成ボタンクリック時のコールバック',
    },
    onEdit: {
      description: 'シナリオ編集時のコールバック',
    },
    onDelete: {
      description: 'シナリオ削除時のコールバック',
    },
    onClick: {
      description: 'シナリオクリック時のコールバック',
    },
    isLoading: {
      description: 'ローディング状態',
    },
  },
  args: {
    onCreateNew: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onClick: fn(),
  },
} satisfies Meta<typeof ScenarioList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleScenarios: Scenario[] = [
  {
    id: '1',
    title: '古城の謎',
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-20T15:30:00'),
  },
  {
    id: '2',
    title: '森の奥の秘密',
    createdAt: new Date('2025-01-10T08:00:00'),
    updatedAt: new Date('2025-01-18T12:00:00'),
  },
  {
    id: '3',
    title: '海底神殿の財宝',
    createdAt: new Date('2025-01-05T14:30:00'),
    updatedAt: new Date('2025-01-15T09:45:00'),
  },
];

export const Default: Story = {
  args: {
    scenarios: sampleScenarios,
  },
};

export const Empty: Story = {
  args: {
    scenarios: [],
  },
};

export const EmptyWithoutCreateButton: Story = {
  args: {
    scenarios: [],
    onCreateNew: undefined,
  },
};

export const Loading: Story = {
  args: {
    scenarios: [],
    isLoading: true,
  },
};

export const SingleScenario: Story = {
  args: {
    scenarios: [sampleScenarios[0]],
  },
};

export const ManyScenarios: Story = {
  args: {
    scenarios: [
      ...sampleScenarios,
      {
        id: '4',
        title: '竜の巣窟',
        createdAt: new Date('2025-01-12T16:00:00'),
        updatedAt: new Date('2025-01-19T10:00:00'),
      },
      {
        id: '5',
        title: '呪われた村',
        createdAt: new Date('2025-01-08T11:30:00'),
        updatedAt: new Date('2025-01-17T14:15:00'),
      },
      {
        id: '6',
        title: '氷の迷宮',
        createdAt: new Date('2025-01-03T09:00:00'),
        updatedAt: new Date('2025-01-13T16:45:00'),
      },
    ],
  },
};

export const WithoutCreateButton: Story = {
  args: {
    scenarios: sampleScenarios,
    onCreateNew: undefined,
  },
};

export const WithoutActions: Story = {
  args: {
    scenarios: sampleScenarios,
    onEdit: undefined,
    onDelete: undefined,
  },
};
