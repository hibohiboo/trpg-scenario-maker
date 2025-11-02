/**
 * シナリオ×キャラクター型定義
 */
export interface ScenarioCharacter {
  scenarioId: string;
  characterId: string;
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
 * キャラクター詳細情報（表示用）
 */
export interface CharacterWithRole extends ScenarioCharacter {
  name: string;
  description?: string;
}
