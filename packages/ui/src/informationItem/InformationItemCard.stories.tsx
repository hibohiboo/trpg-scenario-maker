import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InformationItemCard } from './InformationItemCard';
import type { InformationItem } from './types';

const meta = {
  title: 'InformationItem/InformationItemCard',
  component: InformationItemCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    item: {
      description: '情報項目',
    },
    onClick: {
      description: 'クリック時のコールバック',
    },
    onDelete: {
      description: '削除時のコールバック',
    },
  },
  args: {
    onClick: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof InformationItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItem: InformationItem = {
  id: '1',
  scenarioId: 'scenario-1',
  title: '古びた日記',
  description: '屋敷の書斎で見つけた古い日記。最後のページに謎の暗号が記されている。',
};

export const Default: Story = {
  args: {
    item: sampleItem,
  },
};

export const NoDescription: Story = {
  args: {
    item: {
      ...sampleItem,
      description: '',
    },
  },
};

export const WithoutDelete: Story = {
  args: {
    item: sampleItem,
    onDelete: undefined,
  },
};

export const WithoutClick: Story = {
  args: {
    item: sampleItem,
    onClick: undefined,
  },
};

export const LongDescription: Story = {
  args: {
    item: {
      ...sampleItem,
      description:
        '屋敷の書斎で見つけた古い日記。最後のページに謎の暗号が記されている。暗号を解読すると、地下室への秘密の入り口の場所が記されていることが判明する。日記の持ち主は屋敷の前の所有者で、何か重要なものを隠していたようだ。',
    },
  },
};
