import {
  DeleteConfirmModal,
  ScenarioForm,
  ScenarioList,
  ScenarioImportModal,
} from '@trpg-scenario-maker/ui';
import { usePage } from '../hooks/usePage';

export const Page = () => {
  const vm = usePage();
  return (
    <>
      <ScenarioList
        scenarios={vm.scenarios}
        isLoading={vm.isLoading}
        onCreateNew={vm.onCreateNew}
        onEdit={vm.onEdit}
        onDelete={vm.onDelete}
        onExport={vm.onExport}
        onClick={vm.onClick}
        onImport={() => {
          vm.onImportStart(true);
        }}
      />

      {/* 新規作成モーダル */}
      {vm.isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={vm.onCloseCreateModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              vm.onCloseCreateModal();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-modal-title"
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
            tabIndex={-1}
          >
            <h2 id="create-modal-title" className="text-xl font-bold mb-4">
              新規シナリオ作成
            </h2>
            <ScenarioForm
              title={vm.createTitle}
              onTitleChange={vm.onCreateTitleChange}
              onSubmit={vm.onCreateSubmit}
              onCancel={vm.onCloseCreateModal}
              submitLabel="作成"
              isSubmitting={vm.isSubmitting}
            />
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {vm.isEditModalOpen && vm.editingScenario && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={vm.onCloseEditModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              vm.onCloseEditModal();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
            tabIndex={-1}
          >
            <h2 id="edit-modal-title" className="text-xl font-bold mb-4">
              シナリオ編集
            </h2>
            <ScenarioForm
              title={vm.editTitle}
              onTitleChange={vm.onEditTitleChange}
              onSubmit={vm.onEditSubmit}
              onCancel={vm.onCloseEditModal}
              submitLabel="更新"
              isSubmitting={vm.isSubmitting}
            />
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {vm.isDeleteModalOpen && vm.deletingScenario && (
        <DeleteConfirmModal
          scenario={vm.deletingScenario}
          onConfirm={vm.onDeleteConfirm}
          onCancel={vm.onCloseDeleteModal}
          isDeleting={vm.isDeleting}
        />
      )}

      {/* インポート用モーダル */}
      {vm.isImportModalOpen && (
        <ScenarioImportModal
          onImport={vm.onImport}
          isImporting={vm.isImporting}
          onCancel={() => {
            vm.onImportStart(false);
          }}
        />
      )}
    </>
  );
};
