import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { ScenarioCard } from './ScenarioCard';
import type { Scenario } from './types';

const meta = {
  title: 'Scenario/ScenarioCard',
  component: ScenarioCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    scenario: {
      description: 'シナリオデータ',
    },
    onEdit: {
      description: '編集ボタンクリック時のコールバック',
    },
    onDelete: {
      description: '削除ボタンクリック時のコールバック',
    },
    onClick: {
      description: 'カードクリック時のコールバック',
    },
  },
  args: {
    onEdit: fn(),
    onDelete: fn(),
    onClick: fn(),
  },
} satisfies Meta<typeof ScenarioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleScenario: Scenario = {
  id: '1',
  title: '古城の謎',
  createdAt: new Date('2025-01-15T10:00:00'),
  updatedAt: new Date('2025-01-20T15:30:00'),
};

export const Default: Story = {
  args: {
    scenario: sampleScenario,
  },
};

export const LongTitle: Story = {
  args: {
    scenario: {
      ...sampleScenario,
      title:
        '非常に長いタイトルのシナリオ：失われた魔法の書を求めて冒険者たちが辿る運命の旅路',
    },
  },
};

export const RecentlyCreated: Story = {
  args: {
    scenario: {
      ...sampleScenario,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

export const WithoutEditButton: Story = {
  args: {
    scenario: sampleScenario,
    onEdit: undefined,
  },
};

export const WithoutDeleteButton: Story = {
  args: {
    scenario: sampleScenario,
    onDelete: undefined,
  },
};

export const WithoutActions: Story = {
  args: {
    scenario: sampleScenario,
    onEdit: undefined,
    onDelete: undefined,
  },
};

export const MultipleCards: Story = {
  args: {
    scenario: sampleScenario,
    onEdit: undefined,
    onDelete: undefined,
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ScenarioCard
        scenario={{
          id: '1',
          title: '古城の謎',
          createdAt: new Date('2025-01-15T10:00:00'),
          updatedAt: new Date('2025-01-20T15:30:00'),
        }}
        onEdit={fn()}
        onDelete={fn()}
        onClick={fn()}
      />
      <ScenarioCard
        scenario={{
          id: '2',
          title: '森の奥の秘密',
          createdAt: new Date('2025-01-10T08:00:00'),
          updatedAt: new Date('2025-01-18T12:00:00'),
        }}
        onEdit={fn()}
        onDelete={fn()}
        onClick={fn()}
      />
      <ScenarioCard
        scenario={{
          id: '3',
          title: '海底神殿の財宝',
          createdAt: new Date('2025-01-05T14:30:00'),
          updatedAt: new Date('2025-01-15T09:45:00'),
        }}
        onEdit={fn()}
        onDelete={fn()}
        onClick={fn()}
      />
    </div>
  ),
};
