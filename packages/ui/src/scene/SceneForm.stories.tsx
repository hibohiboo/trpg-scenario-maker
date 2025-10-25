import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { SceneForm } from './SceneForm';
import type { Scene } from './types';

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
    onSubmit: {
      description: '送信時のコールバック',
    },
    onCancel: {
      description: 'キャンセル時のコールバック',
    },
  },
  args: {
    onSubmit: fn(),
    onCancel: fn(),
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
