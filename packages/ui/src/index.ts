// Scene関連（entities/features層から）
export {
  SceneEditor,
  SceneFlowCanvas,
  SceneForm,
  SceneEventForm,
  SceneEventIcon,
} from './features/scenarioSceneManagement';
export type {
  Scene,
  SceneConnection,
  SceneEvent,
  SceneEventType,
  SceneEditorProps,
  SceneFormProps,
  SceneEventFormProps,
  SceneEventIconProps,
} from './features/scenarioSceneManagement';

// Character関連（entities層から）
export {
  CharacterList,
  CharacterForm,
  RelationshipList,
  RelationshipForm,
  DeleteRelationshipModal,
} from './entities/character';
export type {
  Character,
  Relationship,
  RelationshipFormData,
  CharacterListProps,
  CharacterFormProps,
  RelationshipListProps,
  RelationshipFormProps,
  DeleteRelationshipModalProps,
} from './entities/character';
// 後方互換性のため
export { CharacterForm as CharacterCreateModal } from './entities/character';
export type { CharacterFormProps as CharacterCreateModalProps } from './entities/character';

// ScenarioCharacter関連（features/widgets層から）
export {
  ScenarioCharacterList,
  ScenarioCharacterFormModal,
  ScenarioCharacterEditModal,
  CharacterDetailPanel,
} from './features/scenarioCharacterManagement';
export {
  ScenarioCharacterRelationshipList,
  ScenarioCharacterRelationshipFormModal,
} from './features/scenarioRelationshipManagement';
export { CharacterRelationshipGraph } from './widgets/characterRelationshipGraph';
export type {
  CharacterWithRole,
  ScenarioCharacterRelationship,
  ScenarioCharacterRelation,
  CharacterDetailPanelProps,
} from './features/scenarioCharacterManagement';

// InformationItem関連（entities/features層から）
export {
  InformationItemList,
  InformationItemForm,
  InformationItemCard,
} from './entities/informationItem';
export {
  InformationItemConnectionList,
  InformationItemConnectionFormModal,
} from './features/scenarioInformationManagement';
export {
  InformationItemFormWithSceneConnection,
  InformationItemFormModal,
  InformationItemEditModal,
} from './features/scenarioInformationManagement';
export type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
  SceneInformationConnection,
  InformationItemListProps,
  InformationItemFormProps,
  InformationItemCardProps,
} from './entities/informationItem';
export type {
  InformationItemConnectionDisplay,
  InformationItemConnectionListProps,
  InformationItemConnectionFormModalProps,
  InformationItemFormWithSceneConnectionProps,
  InformationItemFormModalProps,
  InformationItemEditModalProps,
} from './features/scenarioInformationManagement';
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
  ScenarioImportModal,
} from './entities/scenario';
export type {
  Scenario,
  ScenarioFormData,
  ScenarioCardProps,
  ScenarioFormProps,
  ScenarioListProps,
  DeleteConfirmModalProps,
} from './entities/scenario';

// Features層（新構造）
export {
  SceneEditor as SceneEditorFeature,
  SceneFlowCanvas as SceneFlowCanvasFeature,
  SceneConnectionSection,
  SceneEventsSection,
  SceneBasicFields,
  SceneInformationSection,
  SceneEventForm as SceneEventFormFeature,
  SceneEventIcon as SceneEventIconFeature,
  CanvasToolbar,
  FlowCanvas as FlowCanvasFeature,
  SceneDetailSidebar,
  ScenarioCharacterList as ScenarioCharacterListFeature,
  ScenarioCharacterFormModal as ScenarioCharacterFormModalFeature,
  ScenarioCharacterEditModal as ScenarioCharacterEditModalFeature,
  CharacterDetailPanel as CharacterDetailPanelFeature,
  CharacterImageGallery as CharacterImageGalleryFeature,
  CharacterImageUploadModal as CharacterImageUploadModalFeature,
  ScenarioCharacterRelationshipList as ScenarioCharacterRelationshipListFeature,
  ScenarioCharacterRelationshipFormModal as ScenarioCharacterRelationshipFormModalFeature,
  InformationItemList as InformationItemListFeature,
  InformationItemForm as InformationItemFormFeature,
  InformationItemCard as InformationItemCardFeature,
  InformationItemConnectionList as InformationItemConnectionListFeature,
  InformationItemConnectionFormModal as InformationItemConnectionFormModalFeature,
} from './features';
export type {
  SceneEventsSectionProps,
  SceneInformationSectionProps,
  SceneEventFormProps as SceneEventFormPropsFeature,
  SceneEventIconProps as SceneEventIconPropsFeature,
  ScenarioCharacterListProps as ScenarioCharacterListPropsFeature,
  CharacterDetailPanelProps as CharacterDetailPanelPropsFeature,
  CharacterImageGalleryProps as CharacterImageGalleryPropsFeature,
  CharacterImageUploadModalProps as CharacterImageUploadModalPropsFeature,
  InformationItemListProps as InformationItemListPropsFeature,
  InformationItemFormProps as InformationItemFormPropsFeature,
  InformationItemCardProps as InformationItemCardPropsFeature,
  InformationItemConnectionListProps as InformationItemConnectionListPropsFeature,
  InformationItemConnectionFormModalProps as InformationItemConnectionFormModalPropsFeature,
} from './features';

// Widgets層（新構造）
export {
  CharacterRelationshipGraph as CharacterRelationshipGraphWidget,
  CharacterGraphToolbar,
} from './widgets';

// Image層（旧構造 - 後方互換性のため残す）
export {
  CharacterImageGallery,
  CharacterImageUploadModal,
} from './features/scenarioCharacterManagement';
export type {
  CharacterImageGalleryProps,
  CharacterImageUploadModalProps,
} from './features/scenarioCharacterManagement';
