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
  CharacterForm,
  RelationshipList,
  RelationshipForm,
  DeleteRelationshipModal,
  CharacterRelationshipPage,
} from './character';
export type {
  Character,
  Relationship,
  RelationshipFormData,
  CharacterListProps,
  CharacterFormProps,
  RelationshipListProps,
  RelationshipFormProps,
  DeleteRelationshipModalProps,
} from './character';
// 後方互換性のため
export { CharacterForm as CharacterCreateModal } from './character';
export type { CharacterFormProps as CharacterCreateModalProps } from './character';
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
export { Loading } from './shared/loading';
export { ErrorMessage } from './shared/error';
export { Layout } from './shared/layout';
export { Modal } from './shared/modal';
export type { ModalProps } from './shared/modal';
export { Tabs } from './shared/tabs';
export type { Tab, TabsProps } from './shared/tabs';
export { Navigation } from './shared/navigation';
export type { NavigationItem, NavigationProps } from './shared/navigation';

// Entities層（新構造）
export { ImageInput } from './entities/image';
export {
  ScenarioCard,
  ScenarioForm,
  ScenarioList,
  DeleteConfirmModal,
} from './entities/scenario';
export type {
  Scenario,
  ScenarioFormData,
  ScenarioCardProps,
  ScenarioFormProps,
  ScenarioListProps,
  DeleteConfirmModalProps,
} from './entities/scenario';

// Image層（旧構造 - 後方互換性のため残す）
export {
  ImageInput as ImageInputLegacy,
  CharacterImageGallery,
  CharacterImageUploadModal,
} from './image';
export type {
  ImageData,
  CharacterImageGalleryProps,
  CharacterImageUploadModalProps,
} from './image';
