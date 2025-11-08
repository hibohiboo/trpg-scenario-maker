/**
 * シナリオ×キャラクター型定義
 */
export interface ScenarioCharacter {
  scenarioId: string;
  characterId: string;
  name: string;
  description?: string;
  role?: string;
}

/**
 * シナリオ内キャラクター関係性型定義
 */
export interface ScenarioCharacterRelationship {
  scenarioId: string;
  fromCharacterId: string;
  toCharacterId: string;
  relationshipName: string;
}

/**
 * シナリオ内キャラクター関係性表示用型定義
 * UIコンポーネントで使用する、キャラクター名を含んだ表示用の型
 */
export interface ScenarioCharacterRelation {
  scenarioId: string;
  fromCharacterId: string;
  toCharacterId: string;
  relationshipName: string;
  fromCharacterName: string;
  toCharacterName: string;
}

/**
 * キャラクター詳細情報（表示用）
 * ScenarioCharacterと同じ構造だが、明示的に型を定義
 */
export type CharacterWithRole = ScenarioCharacter;
