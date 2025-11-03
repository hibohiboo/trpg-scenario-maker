import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharacterRelationshipGraph } from './CharacterRelationshipGraph';
import type { CharacterWithRole, ScenarioCharacterRelationship } from './types';

const meta = {
  title: 'ScenarioCharacter/CharacterRelationshipGraph',
  component: CharacterRelationshipGraph,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'キャラクター間の関係性を可視化するグラフコンポーネント。ReactFlowを使用し、縦方向・横方向の自動整列機能付き。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    characters: {
      description: 'キャラクター一覧',
    },
    relations: {
      description: '関係性一覧',
    },
    isLoading: {
      description: 'ローディング状態',
    },
  },
} satisfies Meta<typeof CharacterRelationshipGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルキャラクター
const sampleCharacters: CharacterWithRole[] = [
  {
    scenarioId: 's1',
    characterId: 'c1',
    name: '勇者',
    description: '世界を救う運命の勇者',
    role: '主人公',
  },
  {
    scenarioId: 's1',
    characterId: 'c2',
    name: '姫',
    description: '国を統治する王女',
    role: '依頼人',
  },
  {
    scenarioId: 's1',
    characterId: 'c3',
    name: '魔王',
    description: '世界を滅ぼそうとする強大な魔王',
    role: '敵',
  },
];

const sampleRelations: ScenarioCharacterRelationship[] = [
  {
    scenarioId: 's1',
    fromCharacterId: 'c1',
    toCharacterId: 'c2',
    relationshipName: '守る',
  },
  {
    scenarioId: 's1',
    fromCharacterId: 'c1',
    toCharacterId: 'c3',
    relationshipName: '倒す',
  },
];

// 複雑な関係性のサンプル
const complexCharacters: CharacterWithRole[] = [
  {
    scenarioId: 's1',
    characterId: 'c1',
    name: '勇者',
    role: '主人公',
  },
  {
    scenarioId: 's1',
    characterId: 'c2',
    name: '姫',
    role: '依頼人',
  },
  {
    scenarioId: 's1',
    characterId: 'c3',
    name: '魔王',
    role: '敵',
  },
  {
    scenarioId: 's1',
    characterId: 'c4',
    name: '賢者',
    role: '助言者',
  },
  {
    scenarioId: 's1',
    characterId: 'c5',
    name: '戦士',
    role: '仲間',
  },
  {
    scenarioId: 's1',
    characterId: 'c6',
    name: '魔法使い',
    role: '仲間',
  },
];

const complexRelations: ScenarioCharacterRelationship[] = [
  {
    scenarioId: 's1',
    fromCharacterId: 'c1',
    toCharacterId: 'c2',
    relationshipName: '守る',
  },
  {
    scenarioId: 's1',
    fromCharacterId: 'c1',
    toCharacterId: 'c3',
    relationshipName: '倒す',
  },
  {
    scenarioId: 's1',
    fromCharacterId: 'c4',
    toCharacterId: 'c1',
    relationshipName: '導く',
  },
  {
    scenarioId: 's1',
    fromCharacterId: 'c5',
    toCharacterId: 'c1',
    relationshipName: '信頼する',
  },
  {
    scenarioId: 's1',
    fromCharacterId: 'c6',
    toCharacterId: 'c1',
    relationshipName: '協力する',
  },
  {
    scenarioId: 's1',
    fromCharacterId: 'c2',
    toCharacterId: 'c4',
    relationshipName: '尊敬する',
  },
  {
    scenarioId: 's1',
    fromCharacterId: 'c3',
    toCharacterId: 'c2',
    relationshipName: '狙う',
  },
];

export const Default: Story = {
  args: {
    characters: sampleCharacters,
    relations: sampleRelations,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    characters: [],
    relations: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    characters: [],
    relations: [],
    isLoading: false,
  },
};

export const NoRelations: Story = {
  args: {
    characters: sampleCharacters,
    relations: [],
    isLoading: false,
  },
};

export const ComplexRelationships: Story = {
  args: {
    characters: complexCharacters,
    relations: complexRelations,
    isLoading: false,
  },
};

export const SingleCharacter: Story = {
  args: {
    characters: [
      {
        scenarioId: 's1',
        characterId: 'c1',
        name: '孤独な勇者',
        description: '一人で戦う勇者',
        role: '主人公',
      },
    ],
    relations: [],
    isLoading: false,
  },
};

export const CircularRelationship: Story = {
  args: {
    characters: [
      {
        scenarioId: 's1',
        characterId: 'c1',
        name: 'キャラA',
        role: '役割A',
      },
      {
        scenarioId: 's1',
        characterId: 'c2',
        name: 'キャラB',
        role: '役割B',
      },
      {
        scenarioId: 's1',
        characterId: 'c3',
        name: 'キャラC',
        role: '役割C',
      },
    ],
    relations: [
      {
        scenarioId: 's1',
        fromCharacterId: 'c1',
        toCharacterId: 'c2',
        relationshipName: '助ける',
      },
      {
        scenarioId: 's1',
        fromCharacterId: 'c2',
        toCharacterId: 'c3',
        relationshipName: '教える',
      },
      {
        scenarioId: 's1',
        fromCharacterId: 'c3',
        toCharacterId: 'c1',
        relationshipName: '恩返し',
      },
    ],
    isLoading: false,
  },
};
