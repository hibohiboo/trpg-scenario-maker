import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RelationshipForm } from './RelationshipForm';
import type { Character } from './types';

const meta = {
  title: 'Character/RelationshipForm',
  component: RelationshipForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    characters: {
      description: 'キャラクターのリスト',
    },
    fromCharacterId: {
      description: '関係元キャラクターID',
    },
    toCharacterId: {
      description: '関係先キャラクターID',
    },
    relationshipName: {
      description: '関係名',
    },
    isSubmitting: {
      description: '送信中かどうか',
    },
    isEditMode: {
      description: '編集モードかどうか',
    },
  },
  args: {
    onFromCharacterChange: fn(),
    onToCharacterChange: fn(),
    onRelationshipNameChange: fn(),
    onSubmit: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof RelationshipForm>;

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

export const Empty: Story = {
  args: {
    characters: sampleCharacters,
    fromCharacterId: '',
    toCharacterId: '',
    relationshipName: '',
    isSubmitting: false,
    isEditMode: false,
  },
};

export const PartiallyFilled: Story = {
  args: {
    characters: sampleCharacters,
    fromCharacterId: '1',
    toCharacterId: '',
    relationshipName: '',
    isSubmitting: false,
    isEditMode: false,
  },
};

export const Filled: Story = {
  args: {
    characters: sampleCharacters,
    fromCharacterId: '1',
    toCharacterId: '2',
    relationshipName: '友人',
    isSubmitting: false,
    isEditMode: false,
  },
};

export const Submitting: Story = {
  args: {
    characters: sampleCharacters,
    fromCharacterId: '1',
    toCharacterId: '2',
    relationshipName: '友人',
    isSubmitting: true,
    isEditMode: false,
  },
};

export const EditMode: Story = {
  args: {
    characters: sampleCharacters,
    fromCharacterId: '1',
    toCharacterId: '2',
    relationshipName: '友人',
    isSubmitting: false,
    isEditMode: true,
    submitLabel: '更新',
  },
};

export const EditModeSubmitting: Story = {
  args: {
    characters: sampleCharacters,
    fromCharacterId: '1',
    toCharacterId: '2',
    relationshipName: '信頼する仲間',
    isSubmitting: true,
    isEditMode: true,
    submitLabel: '更新',
  },
};

export const SingleCharacter: Story = {
  args: {
    characters: [sampleCharacters[0]],
    fromCharacterId: '',
    toCharacterId: '',
    relationshipName: '',
    isSubmitting: false,
    isEditMode: false,
  },
};

export const NoCharacters: Story = {
  args: {
    characters: [],
    fromCharacterId: '',
    toCharacterId: '',
    relationshipName: '',
    isSubmitting: false,
    isEditMode: false,
  },
};
