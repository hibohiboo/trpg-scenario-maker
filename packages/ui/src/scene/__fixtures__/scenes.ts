import type { Scene, SceneConnection } from '../types';

export const sampleScenes: Scene[] = [
  {
    id: '1',
    title: 'オープニング',
    description: '冒険者たちが酒場で出会うシーン',
    isMasterScene: true,
  },
  {
    id: '2',
    title: '古城への道',
    description: '険しい山道を登り、古城へ向かう',
    isMasterScene: false,
  },
  {
    id: '3',
    title: '古城の入口',
    description: '荘厳な古城の門をくぐる',
    isMasterScene: false,
  },
  {
    id: '4',
    title: 'ボス戦',
    description: '古城の最上階でドラゴンと戦う',
    isMasterScene: false,
  },
  {
    id: '5',
    title: 'エンディング',
    description: '冒険の終わりと報酬',
    isMasterScene: false,
  },
];

export const sampleConnections: SceneConnection[] = [
  { id: '1-2', source: '1', target: '2' },
  { id: '2-3', source: '2', target: '3' },
  { id: '3-4', source: '3', target: '4' },
  { id: '4-5', source: '4', target: '5' },
];

export const complexFlowScenes: Scene[] = [
  ...sampleScenes,
  {
    id: '6',
    title: '隠し通路',
    description: '古城の隠された通路を発見',
    isMasterScene: false,
  },
  {
    id: '7',
    title: '宝物庫',
    description: '隠された宝物を発見',
    isMasterScene: false,
  },
];

export const complexFlowConnections: SceneConnection[] = [
  ...sampleConnections,
  { id: '3-6', source: '3', target: '6' },
  { id: '6-7', source: '6', target: '7' },
  { id: '7-5', source: '7', target: '5' },
];

export const masterSceneHighlightScenes: Scene[] = [
  {
    id: '1',
    title: 'スタート（マスターシーン）',
    description: 'マスターシーンは緑色で表示されます',
    isMasterScene: true,
  },
  {
    id: '2',
    title: '通常シーン1',
    description: '通常のシーン',
    isMasterScene: false,
  },
  {
    id: '3',
    title: '通常シーン2',
    description: '通常のシーン',
    isMasterScene: false,
  },
];

export const masterSceneHighlightConnections: SceneConnection[] = [
  { id: '1-2', source: '1', target: '2' },
  { id: '1-3', source: '1', target: '3' },
];
