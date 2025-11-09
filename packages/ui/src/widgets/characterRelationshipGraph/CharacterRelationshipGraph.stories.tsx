import { CharacterRelationshipGraph } from './CharacterRelationshipGraph';
import type {
  CharacterWithRole,
  ScenarioCharacterRelationship,
} from '../../features/scenarioCharacterManagement';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mockCharacters: CharacterWithRole[] = [
  {
    scenarioId: 'scenario1',
    characterId: 'char1',
    name: '勇者アレン',
    description: '正義感が強く、仲間思いの青年',
    role: '主人公',
  },
  {
    scenarioId: 'scenario1',
    characterId: 'char2',
    name: '魔法使いリリィ',
    description: '知識豊富な魔法使い',
    role: 'ヒロイン',
  },
  {
    scenarioId: 'scenario1',
    characterId: 'char3',
    name: '剣士ガルド',
    description: '無口だが腕は確か',
    role: '仲間',
  },
  {
    scenarioId: 'scenario1',
    characterId: 'char4',
    name: '盗賊エリカ',
    description: '身軽で情報収集が得意',
    role: '仲間',
  },
  {
    scenarioId: 'scenario1',
    characterId: 'char5',
    name: '魔王ダークロード',
    description: '世界を支配しようとする魔王',
    role: '敵',
  },
];

const mockRelations: ScenarioCharacterRelationship[] = [
  {
    scenarioId: 'scenario1',
    fromCharacterId: 'char1',
    toCharacterId: 'char2',
    relationshipName: '幼馴染',
  },
  {
    scenarioId: 'scenario1',
    fromCharacterId: 'char1',
    toCharacterId: 'char3',
    relationshipName: '師弟',
  },
  {
    scenarioId: 'scenario1',
    fromCharacterId: 'char2',
    toCharacterId: 'char4',
    relationshipName: '友人',
  },
  {
    scenarioId: 'scenario1',
    fromCharacterId: 'char1',
    toCharacterId: 'char5',
    relationshipName: '宿敵',
  },
  {
    scenarioId: 'scenario1',
    fromCharacterId: 'char3',
    toCharacterId: 'char5',
    relationshipName: '因縁',
  },
];

// サンプル画像データ（Data URL）
const mockCharacterImages: Record<string, string | null> = {
  char1:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNGY0NmU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7li4I8L3RleHQ+PC9zdmc+',
  char2:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZWM0ODk5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7prZQ8L3RleHQ+PC9zdmc+',
  char3: '', // 画像なし
  char4: null, // 画像なし
  char5:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZGMyNjI2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7pq5o8L3RleHQ+PC9zdmc+',
};

const meta = {
  title: 'Widget/CharacterRelationshipGraph',
  component: CharacterRelationshipGraph,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    characters: { control: 'object' },
    relations: { control: 'object' },
    characterImages: { control: 'object' },
    isLoading: { control: 'boolean' },
  },
} satisfies Meta<typeof CharacterRelationshipGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * 5人のキャラクターと5つの関係性を表示
 */
export const Default: Story = {
  args: {
    characters: mockCharacters,
    relations: mockRelations,
    characterImages: {},
    isLoading: false,
  },
};

/**
 * 画像付きキャラクター
 * 一部のキャラクターに画像が設定されている状態
 */
export const WithImages: Story = {
  args: {
    characters: mockCharacters,
    relations: mockRelations,
    characterImages: mockCharacterImages,
    isLoading: false,
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    characters: [],
    relations: [],
    characterImages: {},
    isLoading: true,
  },
};

/**
 * キャラクターなし
 */
export const NoCharacters: Story = {
  args: {
    characters: [],
    relations: [],
    characterImages: {},
    isLoading: false,
  },
};

/**
 * 関係性なし
 * キャラクターのみ表示
 */
export const NoRelations: Story = {
  args: {
    characters: mockCharacters,
    relations: [],
    characterImages: {},
    isLoading: false,
  },
};

/**
 * 2人のシンプルな関係
 */
export const SimpleRelationship: Story = {
  args: {
    characters: mockCharacters.slice(0, 2),
    relations: [mockRelations[0]],
    characterImages: {
      char1: mockCharacterImages.char1,
      char2: mockCharacterImages.char2,
    },
    isLoading: false,
  },
};

/**
 * 複雑な関係性ネットワーク
 * 相互関係を含む多数の関係性
 */
export const ComplexNetwork: Story = {
  args: {
    characters: mockCharacters,
    relations: [
      ...mockRelations,
      // 相互関係を追加
      {
        scenarioId: 'scenario1',
        fromCharacterId: 'char2',
        toCharacterId: 'char1',
        relationshipName: '恋心',
      },
      {
        scenarioId: 'scenario1',
        fromCharacterId: 'char4',
        toCharacterId: 'char1',
        relationshipName: '憧れ',
      },
      {
        scenarioId: 'scenario1',
        fromCharacterId: 'char5',
        toCharacterId: 'char1',
        relationshipName: '執着',
      },
    ],
    characterImages: mockCharacterImages,
    isLoading: false,
  },
};

/**
 * 3人の三角関係
 */
export const TriangleRelationship: Story = {
  args: {
    characters: mockCharacters.slice(0, 3),
    relations: [
      {
        scenarioId: 'scenario1',
        fromCharacterId: 'char1',
        toCharacterId: 'char2',
        relationshipName: '幼馴染',
      },
      {
        scenarioId: 'scenario1',
        fromCharacterId: 'char2',
        toCharacterId: 'char3',
        relationshipName: '友人',
      },
      {
        scenarioId: 'scenario1',
        fromCharacterId: 'char3',
        toCharacterId: 'char1',
        relationshipName: '師弟',
      },
    ],
    characterImages: {
      char1: mockCharacterImages.char1,
      char2: mockCharacterImages.char2,
      char3: null,
    },
    isLoading: false,
  },
};
