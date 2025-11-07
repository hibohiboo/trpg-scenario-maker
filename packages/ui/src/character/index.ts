// 後方互換性のため、entities/characterから再エクスポート
export {
  CharacterList,
  CharacterForm,
  RelationshipList,
  RelationshipForm,
  DeleteRelationshipModal,
} from '../entities/character';
export type {
  Character,
  Relationship,
  RelationshipFormData,
  CharacterListProps,
  CharacterFormProps,
  RelationshipListProps,
  RelationshipFormProps,
  DeleteRelationshipModalProps,
} from '../entities/character';
// CharacterCreateModal は CharacterForm に名前変更されました
export { CharacterForm as CharacterCreateModal } from '../entities/character';
export type { CharacterFormProps as CharacterCreateModalProps } from '../entities/character';
export * from './CharacterRelationshipPage';
