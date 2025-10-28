import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { SceneEvent } from '@trpg-scenario-maker/schema';
import { SceneEventForm } from './SceneEventForm';

const meta = {
  title: 'Scene/SceneEventForm',
  component: SceneEventForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SceneEventForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewEvent: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '新規イベント作成フォーム',
      },
    },
  },
};

export const EditConversation: Story = {
  args: {
    event: {
      id: '1',
      type: 'conversation',
      content: '村人との会話イベント',
      sortOrder: 0,
    } satisfies SceneEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '会話イベントの編集',
      },
    },
  },
};

export const EditBattle: Story = {
  args: {
    event: {
      id: '2',
      type: 'battle',
      content: 'ゴブリンとの戦闘\nHP: 30\n攻撃力: 5',
      sortOrder: 1,
    } satisfies SceneEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '戦闘イベントの編集（複数行のコンテンツ）',
      },
    },
  },
};

export const EditChoice: Story = {
  args: {
    event: {
      id: '3',
      type: 'choice',
      content: '道が二手に分かれている\n1. 左の道を進む\n2. 右の道を進む',
      sortOrder: 2,
    } satisfies SceneEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '選択肢イベントの編集',
      },
    },
  },
};

export const AllEventTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">全イベントタイプのプレビュー</h3>
      <div className="grid grid-cols-3 gap-4">
        {[
          'start',
          'conversation',
          'choice',
          'battle',
          'treasure',
          'trap',
          'puzzle',
          'rest',
          'ending',
        ].map((type) => (
          <div key={type} className="p-2 border rounded">
            <SceneEventForm
              event={
                {
                  id: type,
                  type: type as SceneEvent['type'],
                  content: `${type}イベントのサンプル`,
                  sortOrder: 0,
                } satisfies SceneEvent
              }
              onSave={fn()}
              onCancel={fn()}
            />
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '全イベントタイプの一覧表示',
      },
    },
  },
};
