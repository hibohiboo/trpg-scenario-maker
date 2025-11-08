import { fn } from 'storybook/test';
import { InformationItemForm } from './InformationItemForm';
import type { InformationItem } from './types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'InformationItem/InformationItemForm',
  component: InformationItemForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    item: {
      description: '編集対象の情報項目（新規作成時はundefined）',
    },
    onSubmit: {
      description: '送信時のコールバック',
    },
    onCancel: {
      description: 'キャンセル時のコールバック',
    },
    onDelete: {
      description: '削除時のコールバック',
    },
  },
  args: {
    onSubmit: fn(),
    onCancel: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof InformationItemForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItem: InformationItem = {
  id: '1',
  scenarioId: 'scenario-1',
  title: '古びた日記',
  description: '屋敷の書斎で見つけた古い日記。最後のページに謎の暗号が記されている。',
};

export const CreateNew: Story = {
  args: {
    item: undefined,
  },
};

export const Edit: Story = {
  args: {
    item: sampleItem,
  },
};

export const EditWithoutCancel: Story = {
  args: {
    item: sampleItem,
    onCancel: undefined,
  },
};

export const EditWithoutDelete: Story = {
  args: {
    item: sampleItem,
    onDelete: undefined,
  },
};
