import { Loading } from './Loading';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Common/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullScreen: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: '読み込み中...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    message: '読み込み中...',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    message: '読み込み中...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    message: '読み込み中...',
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'データを取得しています...',
  },
};

export const FullScreen: Story = {
  args: {
    message: '読み込み中...',
    fullScreen: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Loading size="sm" message="Small" />
      <Loading size="md" message="Medium" />
      <Loading size="lg" message="Large" />
    </div>
  ),
};
