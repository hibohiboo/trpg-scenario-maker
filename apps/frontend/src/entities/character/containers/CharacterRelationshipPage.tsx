import { CharacterRelationshipPage as CharacterRelationshipPageUI } from '@trpg-scenario-maker/ui';
import { useCharacterRelationshipPage } from '../hooks/useCharacterRelationshipPage';

export const CharacterRelationshipPage = () => {
  const vm = useCharacterRelationshipPage();
  return (
    <CharacterRelationshipPageUI
      characters={vm.characters}
      relationships={vm.relationships}
      isLoadingCharacters={vm.isLoadingCharacters}
      isLoadingRelationships={vm.isLoadingRelationships}
      isCreateModalOpen={vm.isCreateModalOpen}
      isEditModalOpen={vm.isEditModalOpen}
      isDeleteModalOpen={vm.isDeleteModalOpen}
      createFromCharacterId={vm.createFromCharacterId}
      createToCharacterId={vm.createToCharacterId}
      createRelationshipName={vm.createRelationshipName}
      editRelationshipName={vm.editRelationshipName}
      editingRelationship={vm.editingRelationship}
      deletingRelationship={vm.deletingRelationship}
      isSubmitting={vm.isSubmitting}
      isDeleting={vm.isDeleting}
      onCreateNew={vm.onCreateNew}
      onCloseCreateModal={vm.onCloseCreateModal}
      onCreateFromCharacterChange={vm.onCreateFromCharacterChange}
      onCreateToCharacterChange={vm.onCreateToCharacterChange}
      onCreateRelationshipNameChange={vm.onCreateRelationshipNameChange}
      onCreateSubmit={vm.onCreateSubmit}
      onEdit={vm.onEdit}
      onCloseEditModal={vm.onCloseEditModal}
      onEditRelationshipNameChange={vm.onEditRelationshipNameChange}
      onEditSubmit={vm.onEditSubmit}
      onDelete={vm.onDelete}
      onCloseDeleteModal={vm.onCloseDeleteModal}
      onDeleteConfirm={vm.onDeleteConfirm}
      onCharacterClick={vm.onCharacterClick}
    />
  );
};
