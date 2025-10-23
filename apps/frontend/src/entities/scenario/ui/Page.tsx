import { ScenarioPage } from '@trpg-scenario-maker/ui';
import { usePage } from '../hooks/usePage';

export const Page = () => {
  const vm = usePage();
  return (
    <ScenarioPage
      scenarios={vm.scenarios}
      isLoading={false}
      isCreateModalOpen={false}
      isEditModalOpen={false}
      isDeleteModalOpen={false}
      createTitle=""
      editTitle=""
      editingScenario={null}
      deletingScenario={null}
      isSubmitting={false}
      isDeleting={false}
      onCreateNew={() => {}}
      onCloseCreateModal={() => {}}
      onCreateTitleChange={() => {}}
      onCreateSubmit={() => {}}
      onEdit={() => {}}
      onCloseEditModal={() => {}}
      onEditTitleChange={() => {}}
      onEditSubmit={() => {}}
      onDelete={() => {}}
      onCloseDeleteModal={() => {}}
      onDeleteConfirm={() => {}}
      onClick={() => {}}
    />
  );
};
