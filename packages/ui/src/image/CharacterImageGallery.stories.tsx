import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CharacterImageGallery } from './CharacterImageGallery';
import type { ImageData } from './CharacterImageGallery';

const meta = {
  title: 'Image/CharacterImageGallery',
  component: CharacterImageGallery,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    images: {
      description: '画像データの配列',
    },
    primaryImageId: {
      description: 'メイン画像のID',
    },
    loading: {
      description: 'ローディング状態',
    },
    error: {
      description: 'エラーメッセージ',
    },
    onSetPrimary: {
      description: 'メイン画像設定時のコールバック',
    },
    onDelete: {
      description: '画像削除時のコールバック',
    },
    onAddImage: {
      description: '画像追加ボタンクリック時のコールバック',
    },
  },
  args: {
    onSetPrimary: fn(),
    onDelete: fn(),
    onAddImage: fn(),
  },
} satisfies Meta<typeof CharacterImageGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages: ImageData[] = [
  {
    id: '1',
    dataUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%234299e1"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24"%3E画像1%3C/text%3E%3C/svg%3E',
    isPrimary: true,
  },
  {
    id: '2',
    dataUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%2348bb78"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24"%3E画像2%3C/text%3E%3C/svg%3E',
    isPrimary: false,
  },
  {
    id: '3',
    dataUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ed8936"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24"%3E画像3%3C/text%3E%3C/svg%3E',
    isPrimary: false,
  },
  {
    id: '4',
    dataUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%239f7aea"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24"%3E画像4%3C/text%3E%3C/svg%3E',
    isPrimary: false,
  },
];

export const Default: Story = {
  args: {
    images: sampleImages,
    primaryImageId: '1',
    loading: false,
    error: null,
  },
};

export const Empty: Story = {
  args: {
    images: [],
    primaryImageId: null,
    loading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    images: [],
    primaryImageId: null,
    loading: true,
    error: null,
  },
};

export const WithError: Story = {
  args: {
    images: [],
    primaryImageId: null,
    loading: false,
    error: '画像の読み込みに失敗しました',
  },
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    primaryImageId: '1',
    loading: false,
    error: null,
  },
};

export const ManyImages: Story = {
  args: {
    images: [
      ...sampleImages,
      {
        id: '5',
        dataUrl:
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f56565"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24"%3E画像5%3C/text%3E%3C/svg%3E',
        isPrimary: false,
      },
      {
        id: '6',
        dataUrl:
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%2338b2ac"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24"%3E画像6%3C/text%3E%3C/svg%3E',
        isPrimary: false,
      },
    ],
    primaryImageId: '1',
    loading: false,
    error: null,
  },
};
