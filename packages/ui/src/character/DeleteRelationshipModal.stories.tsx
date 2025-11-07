import { fn } from 'storybook/test';
import { DeleteRelationshipModal } from './DeleteRelationshipModal';
import type { Character, Relationship } from './types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Character/DeleteRelationshipModal',
  component: DeleteRelationshipModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    relationship: {
      description: '削除対象の関係性',
    },
    characters: {
      description: 'キャラクターのリスト',
    },
    isDeleting: {
      description: '削除中かどうか',
    },
  },
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof DeleteRelationshipModal>;

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

const sampleRelationship: Relationship = {
  id: '1',
  fromCharacterId: '1',
  toCharacterId: '2',
  relationshipName: '友人',
};

export const Default: Story = {
  args: {
    relationship: sampleRelationship,
    characters: sampleCharacters,
    isDeleting: false,
  },
};

export const Deleting: Story = {
  args: {
    relationship: sampleRelationship,
    characters: sampleCharacters,
    isDeleting: true,
  },
};

export const LongRelationshipName: Story = {
  args: {
    relationship: {
      ...sampleRelationship,
      relationshipName: '長年の信頼関係で結ばれた戦友',
    },
    characters: sampleCharacters,
    isDeleting: false,
  },
};

export const UnknownCharacter: Story = {
  args: {
    relationship: {
      ...sampleRelationship,
      fromCharacterId: '999',
    },
    characters: sampleCharacters,
    isDeleting: false,
  },
};

export const DifferentRelationships: Story = {
  args: {
    relationship: {
      id: '2',
      fromCharacterId: '1',
      toCharacterId: '3',
      relationshipName: 'ライバル',
    },
    characters: sampleCharacters,
    isDeleting: false,
  },
};
