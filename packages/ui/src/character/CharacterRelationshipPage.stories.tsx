import { fn } from 'storybook/test';
import { CharacterRelationshipPage } from './CharacterRelationshipPage';
import type { Character, Relationship } from './types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Character/CharacterRelationshipPage',
  component: CharacterRelationshipPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onCreateNew: fn(),
    onCloseCreateModal: fn(),
    onCreateFromCharacterChange: fn(),
    onCreateToCharacterChange: fn(),
    onCreateRelationshipNameChange: fn(),
    onCreateSubmit: fn(),
    onEdit: fn(),
    onCloseEditModal: fn(),
    onEditRelationshipNameChange: fn(),
    onEditSubmit: fn(),
    onDelete: fn(),
    onCloseDeleteModal: fn(),
    onDeleteConfirm: fn(),
    onCharacterClick: fn(),
  },
} satisfies Meta<typeof CharacterRelationshipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCharacters: Character[] = [
  {
    id: '1',
    name: 'アリス',
    description: '勇敢な戦士。剣術に優れ、仲間を守ることに命をかける。',
  },
  {
    id: '2',
    name: 'ボブ',
    description: '熟練の魔法使い。古代の魔法に精通している。',
  },
  {
    id: '3',
    name: 'キャロル',
    description: '敏腕の盗賊。素早い身のこなしと鋭い観察眼を持つ。',
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

const baseArgs = {
  isCharacterCreateModalOpen: false,
  createCharacterName: '',
  createCharacterDescription: '',
  onCharacterCreateNew: fn(),
  onCloseCharacterCreateModal: fn(),
  onCreateCharacterNameChange: fn(),
  onCreateCharacterDescriptionChange: fn(),
  onCharacterCreateSubmit: fn(),
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  createFromCharacterId: '',
  createToCharacterId: '',
  createRelationshipName: '',
  editRelationshipName: '',
  editingRelationship: null,
  deletingRelationship: null,
  isSubmitting: false,
  isDeleting: false,
};

export const Default: Story = {
  args: {
    ...baseArgs,
    characters: sampleCharacters,
    relationships: sampleRelationships,
    isLoadingCharacters: false,
    isLoadingRelationships: false,
  },
};

export const Loading: Story = {
  args: {
    ...baseArgs,
    characters: [],
    relationships: [],
    isLoadingCharacters: true,
    isLoadingRelationships: true,
  },
};

export const Empty: Story = {
  args: {
    ...baseArgs,
    characters: [],
    relationships: [],
    isLoadingCharacters: false,
    isLoadingRelationships: false,
  },
};

export const WithCreateModal: Story = {
  args: {
    ...baseArgs,
    characters: sampleCharacters,
    relationships: sampleRelationships,
    isLoadingCharacters: false,
    isLoadingRelationships: false,
    isCreateModalOpen: true,
  },
};

export const WithEditModal: Story = {
  args: {
    ...baseArgs,
    characters: sampleCharacters,
    relationships: sampleRelationships,
    isLoadingCharacters: false,
    isLoadingRelationships: false,
    isEditModalOpen: true,
    editRelationshipName: '親友',
    editingRelationship: sampleRelationships[0],
  },
};

export const WithDeleteModal: Story = {
  args: {
    ...baseArgs,
    characters: sampleCharacters,
    relationships: sampleRelationships,
    isLoadingCharacters: false,
    isLoadingRelationships: false,
    isDeleteModalOpen: true,
    deletingRelationship: sampleRelationships[0],
  },
};

export const ManyCharactersAndRelationships: Story = {
  args: {
    ...baseArgs,
    characters: [
      ...sampleCharacters,
      {
        id: '4',
        name: 'ダン',
        description: '誠実な聖職者。癒しの力で仲間を支える。',
      },
      {
        id: '5',
        name: 'エミリー',
        description: '優秀な吟遊詩人。歌と楽器で士気を高める。',
      },
    ],
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
        toCharacterId: '4',
        relationshipName: '師匠',
      },
      {
        id: '6',
        fromCharacterId: '4',
        toCharacterId: '2',
        relationshipName: '弟子',
      },
    ],
    isLoadingCharacters: false,
    isLoadingRelationships: false,
  },
};
