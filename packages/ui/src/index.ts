export { ScenarioPage } from './scenario/ScenarioPage';
export { SceneEditor, SceneFlowCanvas, SceneForm } from './scene';
export type {
  Scene,
  SceneConnection,
  SceneEditorProps,
  SceneEvent,
  SceneEventType,
} from './scene';
export {
  CharacterList,
  RelationshipList,
  RelationshipForm,
  DeleteRelationshipModal,
  CharacterRelationshipPage,
} from './character';
export type {
  Character,
  Relationship,
  RelationshipFormData,
} from './character';
export {
  ScenarioCharacterList,
  ScenarioCharacterRelationshipList,
  ScenarioCharacterRelationshipFormModal,
  ScenarioCharacterFormModal,
  ScenarioCharacterEditModal,
  CharacterRelationshipGraph,
  CharacterNode,
  CharacterDetailPanel,
} from './scenarioCharacter';
export type {
  CharacterWithRole,
  ScenarioCharacterRelation,
  CharacterDetailPanelProps,
} from './scenarioCharacter';
export {
  InformationItemList,
  InformationItemForm,
  InformationItemCard,
  InformationItemConnectionList,
  InformationItemConnectionFormModal,
} from './informationItem';
export type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
  SceneInformationConnection,
  InformationItemListProps,
  InformationItemFormProps,
  InformationItemCardProps,
  InformationItemConnectionListProps,
  InformationItemConnectionFormModalProps,
  InformationItemConnectionDisplay,
} from './informationItem';
// Shared層（新構造）
export { Button } from './shared/button';
export type { ButtonVariant, ButtonSize } from './shared/button';

// Common層（後方互換性のため残す）
export { Loading, ErrorMessage, Layout, Modal, Tabs } from './common';
export type { Tab, TabsProps } from './common';
export {
  ImageInput,
  CharacterImageGallery,
  CharacterImageUploadModal,
} from './image';
export type {
  ImageData,
  CharacterImageGalleryProps,
  CharacterImageUploadModalProps,
} from './image';
