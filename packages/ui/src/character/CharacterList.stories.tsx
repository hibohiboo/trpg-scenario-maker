import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CharacterList } from './CharacterList';
import type { Character } from './types';

const meta = {
  title: 'Character/CharacterList',
  component: CharacterList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    characters: {
      description: 'キャラクターのリスト',
    },
    isLoading: {
      description: 'ローディング状態',
    },
    onCharacterClick: {
      description: 'キャラクタークリック時のコールバック',
    },
  },
  args: {
    onCharacterClick: fn(),
  },
} satisfies Meta<typeof CharacterList>;

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

export const SingleCharacter: Story = {
  args: {
    characters: [sampleCharacters[0]],
    isLoading: false,
  },
};

export const LongDescription: Story = {
  args: {
    characters: [
      {
        id: '1',
        name: 'アリス',
        description:
          '勇敢な戦士。剣術に優れ、仲間を守ることに命をかける。幼少期に村を襲った魔物から家族を守れなかった経験から、強さを求めて旅を続けている。正義感が強く、困っている人を見過ごせない性格。',
      },
    ],
    isLoading: false,
  },
};

export const NoDescription: Story = {
  args: {
    characters: [
      {
        id: '1',
        name: 'アリス',
        description: '',
      },
      {
        id: '2',
        name: 'ボブ',
        description: '',
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
        id: '4',
        name: 'ダン',
        description: '誠実な聖職者。癒しの力で仲間を支える。',
      },
      {
        id: '5',
        name: 'エミリー',
        description: '優秀な吟遊詩人。歌と楽器で士気を高める。',
      },
      {
        id: '6',
        name: 'フランク',
        description: '頼れる傭兵。戦場での経験が豊富。',
      },
    ],
    isLoading: false,
  },
};
