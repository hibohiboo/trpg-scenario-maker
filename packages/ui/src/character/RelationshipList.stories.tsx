import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RelationshipList } from './RelationshipList';
import type { Character, Relationship } from './types';

const meta = {
  title: 'Character/RelationshipList',
  component: RelationshipList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    relationships: {
      description: '関係性のリスト',
    },
    characters: {
      description: 'キャラクターのリスト',
    },
    isLoading: {
      description: 'ローディング状態',
    },
    onCreateNew: {
      description: '新規作成ボタンクリック時のコールバック',
    },
    onEdit: {
      description: '編集ボタンクリック時のコールバック',
    },
    onDelete: {
      description: '削除ボタンクリック時のコールバック',
    },
  },
  args: {
    onCreateNew: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof RelationshipList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCharacters: Character[] = [
  {
    id: '1',
    name: 'アリス',
    description: '勇敢な戦士',
  },
  {
    id: '2',
    name: 'ボブ',
    description: '熟練の魔法使い',
  },
  {
    id: '3',
    name: 'キャロル',
    description: '敏腕の盗賊',
  },
];

const sampleRelationships: Relationship[] = [
  {
    id: '1',
    fromCharacterId: '1',
    toCharacterId: '2',
    relationshipName: '友人',
  },
  {
    id: '2',
    fromCharacterId: '2',
    toCharacterId: '1',
    relationshipName: '信頼する仲間',
  },
  {
    id: '3',
    fromCharacterId: '1',
    toCharacterId: '3',
    relationshipName: 'ライバル',
  },
];

export const Default: Story = {
  args: {
    relationships: sampleRelationships,
    characters: sampleCharacters,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    relationships: [],
    characters: sampleCharacters,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    relationships: [],
    characters: sampleCharacters,
    isLoading: false,
  },
};

export const SingleRelationship: Story = {
  args: {
    relationships: [sampleRelationships[0]],
    characters: sampleCharacters,
    isLoading: false,
  },
};

export const ManyRelationships: Story = {
  args: {
    relationships: [
      ...sampleRelationships,
      {
        id: '4',
        fromCharacterId: '3',
        toCharacterId: '1',
        relationshipName: '尊敬する先輩',
      },
      {
        id: '5',
        fromCharacterId: '2',
        toCharacterId: '3',
        relationshipName: '師匠',
      },
      {
        id: '6',
        fromCharacterId: '3',
        toCharacterId: '2',
        relationshipName: '弟子',
      },
    ],
    characters: sampleCharacters,
    isLoading: false,
  },
};

export const WithoutCreateButton: Story = {
  args: {
    relationships: sampleRelationships,
    characters: sampleCharacters,
    isLoading: false,
    onCreateNew: undefined,
  },
};

export const WithoutActions: Story = {
  args: {
    relationships: sampleRelationships,
    characters: sampleCharacters,
    isLoading: false,
    onEdit: undefined,
    onDelete: undefined,
  },
};

export const UnknownCharacter: Story = {
  args: {
    relationships: [
      {
        id: '1',
        fromCharacterId: '999',
        toCharacterId: '2',
        relationshipName: '友人',
      },
    ],
    characters: sampleCharacters,
    isLoading: false,
  },
};
