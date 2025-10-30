import { CharacterCreateModal } from './CharacterCreateModal';
import { CharacterList } from './CharacterList';
import { DeleteRelationshipModal } from './DeleteRelationshipModal';
import { RelationshipForm } from './RelationshipForm';
import { RelationshipList } from './RelationshipList';
import type { Character, Relationship, RelationshipFormData } from './types';

export interface CharacterRelationshipPageProps {
  /** キャラクターのリスト */
  characters: Character[];
  /** 関係性のリスト */
  relationships: Relationship[];
  /** キャラクター読み込み中 */
  isLoadingCharacters?: boolean;
  /** 関係性読み込み中 */
  isLoadingRelationships?: boolean;

  /** キャラクター作成モーダルの表示状態 */
  isCharacterCreateModalOpen: boolean;
  /** キャラクター作成フォーム: 名前 */
  createCharacterName: string;
  /** キャラクター作成フォーム: 説明 */
  createCharacterDescription: string;
  /** キャラクター作成ボタンクリック */
  onCharacterCreateNew: () => void;
  /** キャラクター作成モーダルを閉じる */
  onCloseCharacterCreateModal: () => void;
  /** キャラクター作成フォーム: 名前変更 */
  onCreateCharacterNameChange: (name: string) => void;
  /** キャラクター作成フォーム: 説明変更 */
  onCreateCharacterDescriptionChange: (description: string) => void;
  /** キャラクター作成フォーム送信 */
  onCharacterCreateSubmit: () => void;

  /** 関係性作成モーダルの表示状態 */
  isCreateModalOpen: boolean;
  /** 編集モーダルの表示状態 */
  isEditModalOpen: boolean;
  /** 削除確認モーダルの表示状態 */
  isDeleteModalOpen: boolean;
  /** 作成フォーム: 関係元キャラクターID */
  createFromCharacterId: string;
  /** 作成フォーム: 関係先キャラクターID */
  createToCharacterId: string;
  /** 作成フォーム: 関係名 */
  createRelationshipName: string;
  /** 編集フォーム: 関係名 */
  editRelationshipName: string;
  /** 編集対象の関係性 */
  editingRelationship: Relationship | null;
  /** 削除対象の関係性 */
  deletingRelationship: Relationship | null;
  /** 送信中かどうか */
  isSubmitting?: boolean;
  /** 削除中かどうか */
  isDeleting?: boolean;
  /** 新規作成ボタンクリック時のコールバック */
  onCreateNew: () => void;
  /** 作成モーダルを閉じるコールバック */
  onCloseCreateModal: () => void;
  /** 作成フォーム: 関係元キャラクター変更 */
  onCreateFromCharacterChange: (characterId: string) => void;
  /** 作成フォーム: 関係先キャラクター変更 */
  onCreateToCharacterChange: (characterId: string) => void;
  /** 作成フォーム: 関係名変更 */
  onCreateRelationshipNameChange: (name: string) => void;
  /** 作成フォーム送信 */
  onCreateSubmit: (data: RelationshipFormData) => void;
  /** 編集開始 */
  onEdit: (relationship: Relationship) => void;
  /** 編集モーダルを閉じる */
  onCloseEditModal: () => void;
  /** 編集フォーム: 関係名変更 */
  onEditRelationshipNameChange: (name: string) => void;
  /** 編集フォーム送信 */
  onEditSubmit: (data: RelationshipFormData) => void;
  /** 削除開始 */
  onDelete: (relationship: Relationship) => void;
  /** 削除確認モーダルを閉じる */
  onCloseDeleteModal: () => void;
  /** 削除確認 */
  onDeleteConfirm: () => void;
  /** キャラクタークリック */
  onCharacterClick?: (character: Character) => void;
}

/**
 * キャラクター関係性管理ページコンポーネント
 */
export function CharacterRelationshipPage({
  characters,
  relationships,
  isLoadingCharacters,
  isLoadingRelationships,
  isCharacterCreateModalOpen,
  createCharacterName,
  createCharacterDescription,
  onCharacterCreateNew,
  onCloseCharacterCreateModal,
  onCreateCharacterNameChange,
  onCreateCharacterDescriptionChange,
  onCharacterCreateSubmit,
  isCreateModalOpen,
  isEditModalOpen,
  isDeleteModalOpen,
  createFromCharacterId,
  createToCharacterId,
  createRelationshipName,
  editRelationshipName,
  editingRelationship,
  deletingRelationship,
  isSubmitting,
  isDeleting,
  onCreateNew,
  onCloseCreateModal,
  onCreateFromCharacterChange,
  onCreateToCharacterChange,
  onCreateRelationshipNameChange,
  onCreateSubmit,
  onEdit,
  onCloseEditModal,
  onEditRelationshipNameChange,
  onEditSubmit,
  onDelete,
  onCloseDeleteModal,
  onDeleteConfirm,
  onCharacterClick,
}: CharacterRelationshipPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">キャラクター管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側: キャラクター一覧 */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">キャラクター</h2>
          <CharacterList
            characters={characters}
            isLoading={isLoadingCharacters}
            onCharacterClick={onCharacterClick}
            onCreateNew={onCharacterCreateNew}
          />
        </div>

        {/* 右側: 関係性一覧 */}
        <div className="lg:col-span-2">
          <RelationshipList
            relationships={relationships}
            characters={characters}
            isLoading={isLoadingRelationships}
            onCreateNew={onCreateNew}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>

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
              関係性を追加
            </h2>
            <RelationshipForm
              characters={characters}
              fromCharacterId={createFromCharacterId}
              toCharacterId={createToCharacterId}
              relationshipName={createRelationshipName}
              onFromCharacterChange={onCreateFromCharacterChange}
              onToCharacterChange={onCreateToCharacterChange}
              onRelationshipNameChange={onCreateRelationshipNameChange}
              onSubmit={onCreateSubmit}
              onCancel={onCloseCreateModal}
              submitLabel="追加"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {isEditModalOpen && editingRelationship && (
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
              関係性を編集
            </h2>
            <RelationshipForm
              characters={characters}
              fromCharacterId={editingRelationship.fromCharacterId}
              toCharacterId={editingRelationship.toCharacterId}
              relationshipName={editRelationshipName}
              onFromCharacterChange={() => {}}
              onToCharacterChange={() => {}}
              onRelationshipNameChange={onEditRelationshipNameChange}
              onSubmit={onEditSubmit}
              onCancel={onCloseEditModal}
              submitLabel="更新"
              isSubmitting={isSubmitting}
              isEditMode
            />
          </div>
        </div>
      )}

      {/* キャラクター作成モーダル */}
      <CharacterCreateModal
        isOpen={isCharacterCreateModalOpen}
        name={createCharacterName}
        description={createCharacterDescription}
        isSubmitting={isSubmitting}
        onClose={onCloseCharacterCreateModal}
        onNameChange={onCreateCharacterNameChange}
        onDescriptionChange={onCreateCharacterDescriptionChange}
        onSubmit={onCharacterCreateSubmit}
      />

      {/* 削除確認モーダル */}
      {isDeleteModalOpen && deletingRelationship && (
        <DeleteRelationshipModal
          relationship={deletingRelationship}
          characters={characters}
          onConfirm={onDeleteConfirm}
          onCancel={onCloseDeleteModal}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
