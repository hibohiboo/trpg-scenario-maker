import { SceneEventIcon } from './SceneEventIcon';
import type { SceneEventType } from '../types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Scene/SceneEventIcon',
  component: SceneEventIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'イベントタイプ',
      control: 'select',
      options: [
        'start',
        'conversation',
        'choice',
        'battle',
        'treasure',
        'trap',
        'puzzle',
        'rest',
        'ending',
      ],
    },
    size: {
      description: 'アイコンサイズ',
      control: { type: 'number', min: 8, max: 128, step: 4 },
    },
    className: {
      description: 'CSSクラス名',
    },
    title: {
      description: 'ツールチップテキスト',
    },
  },
} satisfies Meta<typeof SceneEventIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = {
  args: {
    type: 'start',
    size: 24,
    title: 'シーン開始',
  },
};

export const Conversation: Story = {
  args: {
    type: 'conversation',
    size: 24,
    title: '会話イベント',
  },
};

export const Choice: Story = {
  args: {
    type: 'choice',
    size: 24,
    title: '選択肢',
  },
};

export const Battle: Story = {
  args: {
    type: 'battle',
    size: 24,
    title: '戦闘',
  },
};

export const Treasure: Story = {
  args: {
    type: 'treasure',
    size: 24,
    title: '宝箱',
  },
};

export const Trap: Story = {
  args: {
    type: 'trap',
    size: 24,
    title: '罠',
  },
};

export const Puzzle: Story = {
  args: {
    type: 'puzzle',
    size: 24,
    title: '謎解き',
  },
};

export const Rest: Story = {
  args: {
    type: 'rest',
    size: 24,
    title: '休息',
  },
};

export const Ending: Story = {
  args: {
    type: 'ending',
    size: 24,
    title: 'エンディング',
  },
};

export const AllTypes: Story = {
  args: { type: 'start', size: 0, title: 'foo' },
  render: () => {
    const eventTypes: SceneEventType[] = [
      'start',
      'conversation',
      'choice',
      'battle',
      'treasure',
      'trap',
      'puzzle',
      'rest',
      'ending',
    ];

    return (
      <div className="flex flex-col gap-4">
        {eventTypes.map((type) => (
          <div key={type} className="flex items-center gap-4">
            <SceneEventIcon type={type} size={24} />
            <span className="text-sm font-medium">{type}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const DifferentSizes: Story = {
  args: { type: 'start', size: 0, title: 'foo' },
  render: () => {
    const sizes = [12, 16, 24, 32, 48, 64];

    return (
      <div className="flex flex-col gap-6">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-4">
            <SceneEventIcon type="battle" size={size} />
            <span className="text-sm">{size}px</span>
          </div>
        ))}
      </div>
    );
  },
};

export const WithColors: Story = {
  args: { type: 'start', size: 0, title: 'foo' },
  render: () => {
    const colors = [
      { className: 'text-red-500', label: 'Red' },
      { className: 'text-blue-500', label: 'Blue' },
      { className: 'text-green-500', label: 'Green' },
      { className: 'text-yellow-500', label: 'Yellow' },
      { className: 'text-purple-500', label: 'Purple' },
      { className: 'text-gray-500', label: 'Gray' },
    ];

    return (
      <div className="flex flex-col gap-4">
        {colors.map(({ className, label }) => (
          <div key={label} className="flex items-center gap-4">
            <SceneEventIcon type="battle" size={24} className={className} />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    );
  },
};
