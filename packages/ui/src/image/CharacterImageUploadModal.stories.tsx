import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CharacterImageUploadModal } from './CharacterImageUploadModal';

const meta = {
  title: 'Image/CharacterImageUploadModal',
  component: CharacterImageUploadModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      description: 'モーダルの開閉状態',
    },
    onClose: {
      description: 'モーダルを閉じる時のコールバック',
    },
    onSubmit: {
      description: '画像をアップロードする時のコールバック',
    },
    hasExistingImages: {
      description: '既存の画像が存在するかどうか',
    },
    uploading: {
      description: 'アップロード中かどうか',
    },
  },
  args: {
    onClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof CharacterImageUploadModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    hasExistingImages: false,
    uploading: false,
  },
};

export const WithExistingImages: Story = {
  args: {
    isOpen: true,
    hasExistingImages: true,
    uploading: false,
  },
};

export const Uploading: Story = {
  args: {
    isOpen: true,
    hasExistingImages: true,
    uploading: true,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    hasExistingImages: false,
    uploading: false,
  },
};
