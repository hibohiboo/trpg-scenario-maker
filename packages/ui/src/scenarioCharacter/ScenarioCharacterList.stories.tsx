import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ScenarioCharacterList } from './ScenarioCharacterList';
import type { CharacterWithRole } from './types';

const meta = {
  title: 'ScenarioCharacter/ScenarioCharacterList',
  component: ScenarioCharacterList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    characters: {
      description: 'シナリオに登場するキャラクターのリスト',
    },
    isLoading: {
      description: 'ローディング状態',
    },
    onCharacterClick: {
      description: 'キャラクタークリック時のコールバック',
    },
    onRemoveCharacter: {
      description: 'キャラクター削除ボタンクリック時のコールバック',
    },
    onCreateNew: {
      description: '新規キャラクター作成ボタンクリック時のコールバック',
    },
    onAddExisting: {
      description: '既存キャラクター追加ボタンクリック時のコールバック',
    },
  },
  args: {
    onCharacterClick: fn(),
    onRemoveCharacter: fn(),
    onCreateNew: fn(),
    onAddExisting: fn(),
  },
} satisfies Meta<typeof ScenarioCharacterList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCharacters: CharacterWithRole[] = [
  {
    scenarioId: 'scenario-1',
    characterId: 'char-1',
    name: '勇者アルス',
    description: '世界を救う運命を背負った若き勇者',
    role: '主人公',
  },
  {
    scenarioId: 'scenario-1',
    characterId: 'char-2',
    name: '姫エリザベス',
    description: '国を治める聡明な姫',
    role: '協力者',
  },
  {
    scenarioId: 'scenario-1',
    characterId: 'char-3',
    name: '魔王ダークロード',
    description: '世界を闇に包もうとする邪悪な存在',
    role: '敵',
  },
];

export const Default: Story = {
  args: {
    characters: sampleCharacters,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    characters: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    characters: [],
    isLoading: false,
  },
};

export const WithoutRole: Story = {
  args: {
    characters: [
      {
        scenarioId: 'scenario-1',
        characterId: 'char-1',
        name: '勇者アルス',
        description: '世界を救う運命を背負った若き勇者',
      },
      {
        scenarioId: 'scenario-1',
        characterId: 'char-2',
        name: '姫エリザベス',
        description: '国を治める聡明な姫',
      },
    ],
    isLoading: false,
  },
};

export const SingleCharacter: Story = {
  args: {
    characters: [sampleCharacters[0]],
    isLoading: false,
  },
};

export const NoDescription: Story = {
  args: {
    characters: [
      {
        scenarioId: 'scenario-1',
        characterId: 'char-1',
        name: '勇者アルス',
        role: '主人公',
      },
      {
        scenarioId: 'scenario-1',
        characterId: 'char-2',
        name: '姫エリザベス',
        role: '協力者',
      },
    ],
    isLoading: false,
  },
};

export const ManyCharacters: Story = {
  args: {
    characters: [
      ...sampleCharacters,
      {
        scenarioId: 'scenario-1',
        characterId: 'char-4',
        name: '賢者マーリン',
        description: '古代の知識を持つ賢者',
        role: '助言者',
      },
      {
        scenarioId: 'scenario-1',
        characterId: 'char-5',
        name: '騎士ランスロット',
        description: '王国最強の騎士',
        role: '協力者',
      },
      {
        scenarioId: 'scenario-1',
        characterId: 'char-6',
        name: '盗賊ロビン',
        description: '義賊として知られる盗賊',
        role: '協力者',
      },
    ],
    isLoading: false,
  },
};

export const LongDescription: Story = {
  args: {
    characters: [
      {
        scenarioId: 'scenario-1',
        characterId: 'char-1',
        name: '勇者アルス',
        description:
          '世界を救う運命を背負った若き勇者。幼少期に村を襲った魔物から家族を守れなかった経験から、強さを求めて旅を続けている。正義感が強く、困っている人を見過ごせない性格。',
        role: '主人公',
      },
    ],
    isLoading: false,
  },
};

export const WithoutRemoveButton: Story = {
  args: {
    characters: sampleCharacters,
    isLoading: false,
    onRemoveCharacter: undefined,
  },
};

export const WithoutCreateButton: Story = {
  args: {
    characters: sampleCharacters,
    isLoading: false,
    onCreateNew: undefined,
  },
};

export const WithoutAddExistingButton: Story = {
  args: {
    characters: sampleCharacters,
    isLoading: false,
    onAddExisting: undefined,
  },
};
