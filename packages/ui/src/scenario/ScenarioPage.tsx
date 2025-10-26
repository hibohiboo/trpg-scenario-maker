import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ScenarioForm } from './ScenarioForm';
import { ScenarioList } from './ScenarioList';
import { Layout } from '../common';
import type { Scenario, ScenarioFormData } from './types';

export interface ScenarioPageProps {
  /** シナリオのリスト */
  scenarios: Scenario[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** 新規作成モーダルの表示状態 */
  isCreateModalOpen: boolean;
  /** 編集モーダルの表示状態 */
  isEditModalOpen: boolean;
  /** 削除確認モーダルの表示状態 */
  isDeleteModalOpen: boolean;
  /** 新規作成フォームのタイトル */
  createTitle: string;
  /** 編集フォームのタイトル */
  editTitle: string;
  /** 編集対象のシナリオ */
  editingScenario: Scenario | null;
  /** 削除対象のシナリオ */
  deletingScenario: Scenario | null;
  /** 送信中かどうか */
  isSubmitting?: boolean;
  /** 削除中かどうか */
  isDeleting?: boolean;
  /** 新規作成ボタンクリック時のコールバック */
  onCreateNew: () => void;
  /** 新規作成モーダルを閉じるコールバック */
  onCloseCreateModal: () => void;
  /** 新規作成フォームのタイトル変更コールバック */
  onCreateTitleChange: (title: string) => void;
  /** 新規作成フォーム送信時のコールバック */
  onCreateSubmit: (data: ScenarioFormData) => void;
  /** シナリオ編集開始時のコールバック */
  onEdit: (scenario: Scenario) => void;
  /** 編集モーダルを閉じるコールバック */
  onCloseEditModal: () => void;
  /** 編集フォームのタイトル変更コールバック */
  onEditTitleChange: (title: string) => void;
  /** 編集フォーム送信時のコールバック */
  onEditSubmit: (data: ScenarioFormData) => void;
  /** シナリオ削除開始時のコールバック */
  onDelete: (scenario: Scenario) => void;
  /** 削除確認モーダルを閉じるコールバック */
  onCloseDeleteModal: () => void;
  /** 削除確認時のコールバック */
  onDeleteConfirm: () => void;
  /** シナリオクリック時のコールバック */
  onClick?: (scenario: Scenario) => void;
}

/**
 * シナリオページコンポーネント
 * シナリオのCRUD機能を提供するページコンポーネント
 */
export function ScenarioPage({
  scenarios,
  isLoading,
  isCreateModalOpen,
  isEditModalOpen,
  isDeleteModalOpen,
  createTitle,
  editTitle,
  editingScenario,
  deletingScenario,
  isSubmitting,
  isDeleting,
  onCreateNew,
  onCloseCreateModal,
  onCreateTitleChange,
  onCreateSubmit,
  onEdit,
  onCloseEditModal,
  onEditTitleChange,
  onEditSubmit,
  onDelete,
  onCloseDeleteModal,
  onDeleteConfirm,
  onClick,
}: ScenarioPageProps) {
  return (
    <Layout>
      <ScenarioList
        scenarios={scenarios}
        isLoading={isLoading}
        onCreateNew={onCreateNew}
        onEdit={onEdit}
        onDelete={onDelete}
        onClick={onClick}
      />

      {/* 新規作成モーダル */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onCloseCreateModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onCloseCreateModal();
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
              title={createTitle}
              onTitleChange={onCreateTitleChange}
              onSubmit={onCreateSubmit}
              onCancel={onCloseCreateModal}
              submitLabel="作成"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {isEditModalOpen && editingScenario && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onCloseEditModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onCloseEditModal();
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
              title={editTitle}
              onTitleChange={onEditTitleChange}
              onSubmit={onEditSubmit}
              onCancel={onCloseEditModal}
              submitLabel="更新"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {isDeleteModalOpen && deletingScenario && (
        <DeleteConfirmModal
          scenario={deletingScenario}
          onConfirm={onDeleteConfirm}
          onCancel={onCloseDeleteModal}
          isDeleting={isDeleting}
        />
      )}
    </Layout>
  );
}
