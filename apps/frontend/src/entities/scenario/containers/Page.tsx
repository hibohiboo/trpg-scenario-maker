import { ScenarioPage } from '@trpg-scenario-maker/ui';
import { usePage } from '../hooks/usePage';

export const Page = () => {
  const vm = usePage();
  return (
    <ScenarioPage
      scenarios={vm.scenarios}
      isLoading={vm.isLoading}
      isCreateModalOpen={vm.isCreateModalOpen}
      isEditModalOpen={vm.isEditModalOpen}
      isDeleteModalOpen={vm.isDeleteModalOpen}
      createTitle={vm.createTitle}
      editTitle={vm.editTitle}
      editingScenario={vm.editingScenario}
      deletingScenario={vm.deletingScenario}
      isSubmitting={vm.isSubmitting}
      isDeleting={vm.isDeleting}
      onCreateNew={vm.onCreateNew}
      onCloseCreateModal={vm.onCloseCreateModal}
      onCreateTitleChange={vm.onCreateTitleChange}
      onCreateSubmit={vm.onCreateSubmit}
      onEdit={vm.onEdit}
      onCloseEditModal={vm.onCloseEditModal}
      onEditTitleChange={vm.onEditTitleChange}
      onEditSubmit={vm.onEditSubmit}
      onDelete={vm.onDelete}
      onCloseDeleteModal={vm.onCloseDeleteModal}
      onDeleteConfirm={vm.onDeleteConfirm}
      onClick={vm.onClick}
    />
  );
};
