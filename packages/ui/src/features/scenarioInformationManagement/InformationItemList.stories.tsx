import { fn } from 'storybook/test';
import { InformationItemList } from './InformationItemList';
import type { InformationItem } from '../../informationItem/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'InformationItem/InformationItemList',
  component: InformationItemList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: '情報項目のリスト',
    },
    isLoading: {
      description: 'ローディング状態',
    },
    onItemClick: {
      description: '情報項目クリック時のコールバック',
    },
    onEdit: {
      description: '編集ボタンクリック時のコールバック',
    },
    onCreateNew: {
      description: '新規作成ボタンクリック時のコールバック',
    },
    onDelete: {
      description: '削除ボタンクリック時のコールバック',
    },
  },
  args: {
    onItemClick: fn(),
    onEdit: fn(),
    onCreateNew: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof InformationItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems: InformationItem[] = [
  {
    id: '1',
    scenarioId: 'scenario-1',
    title: '古びた日記',
    description: '屋敷の書斎で見つけた古い日記。最後のページに謎の暗号が記されている。',
  },
  {
    id: '2',
    scenarioId: 'scenario-1',
    title: '鍵のかかった箱',
    description: '地下室で発見した小さな箱。特殊な鍵が必要そうだ。',
  },
  {
    id: '3',
    scenarioId: 'scenario-1',
    title: '目撃者の証言',
    description: '近所の住人が見た不審な人物についての情報。',
  },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    items: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    isLoading: false,
  },
};

export const SingleItem: Story = {
  args: {
    items: [sampleItems[0]],
    isLoading: false,
  },
};

export const NoDescription: Story = {
  args: {
    items: [
      {
        id: '1',
        scenarioId: 'scenario-1',
        title: '古びた日記',
        description: '',
      },
      {
        id: '2',
        scenarioId: 'scenario-1',
        title: '鍵のかかった箱',
        description: '',
      },
    ],
    isLoading: false,
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      ...sampleItems,
      {
        id: '4',
        scenarioId: 'scenario-1',
        title: '新聞記事',
        description: '10年前の事件を報じる新聞の切り抜き。',
      },
      {
        id: '5',
        scenarioId: 'scenario-1',
        title: '写真',
        description: '古い集合写真。写っている人物の一人に見覚えがある。',
      },
    ],
    isLoading: false,
  },
};
