import { useCreateScenario } from './useCreateScenario';
import { useDeleteScenario } from './useDeleteScenario';
import { useEditScenario } from './useEditScenario';
import { useExportScenario } from './useExportScenario';
import { useScenarioList } from './useScenarioList';

/**
 * シナリオページ全体の状態とロジックを統合するフック
 * 各機能ごとの専用フックを組み合わせて、ページレベルのインターフェースを提供する
 */
export const usePage = () => {
  // 各機能専用のフックを使用
  const list = useScenarioList();
  const create = useCreateScenario();
  const edit = useEditScenario();
  const deleteScenario = useDeleteScenario();
  const exportScenario = useExportScenario();

  return {
    // 一覧表示
    scenarios: list.scenarios,
    isLoading: list.isLoading,
    onClick: list.onClick,

    // 作成モーダル
    isCreateModalOpen: create.isOpen,
    createTitle: create.title,
    isSubmitting: create.isSubmitting,
    onCreateNew: create.open,
    onCloseCreateModal: create.close,
    onCreateTitleChange: create.setTitle,
    onCreateSubmit: create.submit,

    // 編集モーダル
    isEditModalOpen: edit.isOpen,
    editTitle: edit.title,
    editingScenario: edit.editingScenario,
    onEdit: edit.open,
    onCloseEditModal: edit.close,
    onEditTitleChange: edit.setTitle,
    onEditSubmit: edit.submit,

    // 削除モーダル
    isDeleteModalOpen: deleteScenario.isOpen,
    deletingScenario: deleteScenario.deletingScenario,
    isDeleting: deleteScenario.isDeleting,
    onDelete: deleteScenario.open,
    onCloseDeleteModal: deleteScenario.close,
    onDeleteConfirm: deleteScenario.confirm,

    // エクスポート
    onExport: exportScenario.exportScenario,
    isExporting: exportScenario.isExporting,
  };
};
