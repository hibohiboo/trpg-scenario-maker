// CRUD components are now in entities/informationItem
export { InformationItemList } from '../../entities/informationItem';
export type { InformationItemListProps } from '../../entities/informationItem';
export { InformationItemCard } from '../../entities/informationItem';
export type { InformationItemCardProps } from '../../entities/informationItem';

// Feature-specific: Scene connection
export { InformationItemFormWithSceneConnection } from './InformationItemFormWithSceneConnection';
export type { InformationItemFormWithSceneConnectionProps } from './InformationItemFormWithSceneConnection';
export { SceneConnectionSection } from './SceneConnectionSection';
export type { SceneConnectionSectionProps } from './SceneConnectionSection';

// Feature-specific: InformationItem connections
export { InformationItemConnectionList } from './InformationItemConnectionList';
export type { InformationItemConnectionListProps } from './InformationItemConnectionList';
export { InformationItemConnectionFormModal } from './InformationItemConnectionFormModal';
export type { InformationItemConnectionFormModalProps } from './InformationItemConnectionFormModal';

// For backward compatibility (old name)
export { InformationItemForm } from '../../entities/informationItem';
export type { InformationItemFormProps } from '../../entities/informationItem';
