import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import type { Scenario } from './types';

const meta = {
  title: 'Scenario/DeleteConfirmModal',
  component: DeleteConfirmModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    scenario: {
      description: '削除対象のシナリオ',
    },
    onConfirm: {
      description: '削除確認時のコールバック',
    },
    onCancel: {
      description: 'キャンセル時のコールバック',
    },
    isDeleting: {
      description: '削除処理中かどうか',
    },
  },
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof DeleteConfirmModal>;

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

export const Deleting: Story = {
  args: {
    scenario: sampleScenario,
    isDeleting: true,
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

export const WithBackgroundContent: Story = {
  render: (args) => (
    <div>
      {/* 背景コンテンツ */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">シナリオ一覧</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border p-4 rounded">
              サンプルカード {i}
            </div>
          ))}
        </div>
      </div>
      {/* モーダル */}
      <DeleteConfirmModal {...args} />
    </div>
  ),
  args: {
    scenario: sampleScenario,
  },
};
