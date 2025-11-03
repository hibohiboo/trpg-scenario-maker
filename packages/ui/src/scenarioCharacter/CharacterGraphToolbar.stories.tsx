import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharacterGraphToolbar } from './CharacterGraphToolbar';

const meta = {
  title: 'ScenarioCharacter/CharacterGraphToolbar',
  component: CharacterGraphToolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'キャラクター関係性グラフの自動整列ツールバー。縦方向(上から下)と横方向(左から右)の整列をサポート。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onLayout: {
      description: '整列方向を指定するコールバック関数',
      action: 'layout',
    },
  },
} satisfies Meta<typeof CharacterGraphToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onLayout: (direction) => {
      console.log(`Layout direction: ${direction}`);
    },
  },
};
