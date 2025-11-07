/**
 * キャラクター型
 */
export interface Character {
  id: string;
  name: string;
  description: string;
}

/**
 * 関係性型
 */
export interface Relationship {
  id: string;
  fromCharacterId: string;
  toCharacterId: string;
  relationshipName: string;
}

/**
 * 関係性フォームデータ型
 */
export interface RelationshipFormData {
  fromCharacterId: string;
  toCharacterId: string;
  relationshipName: string;
}
