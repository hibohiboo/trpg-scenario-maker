import {
  CharacterCreateModal,
  CharacterList,
  DeleteRelationshipModal,
  RelationshipForm,
  RelationshipList,
} from '@trpg-scenario-maker/ui';
import { useCharacterRelationshipPage } from '../hooks/useCharacterRelationshipPage';

export const CharacterRelationshipPage = () => {
  const vm = useCharacterRelationshipPage();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">キャラクター管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側: キャラクター一覧 */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">キャラクター</h2>
          <CharacterList
            characters={vm.characters}
            isLoading={vm.isLoadingCharacters}
            onCharacterClick={vm.onCharacterClick}
            onCreateNew={vm.onCharacterCreateNew}
          />
        </div>

        {/* 右側: 関係性一覧 */}
        <div className="lg:col-span-2">
          <RelationshipList
            relationships={vm.relationships}
            characters={vm.characters}
            isLoading={vm.isLoadingRelationships}
            onCreateNew={vm.onCreateNew}
            onEdit={vm.onEdit}
            onDelete={vm.onDelete}
          />
        </div>
      </div>

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
              関係性を追加
            </h2>
            <RelationshipForm
              characters={vm.characters}
              fromCharacterId={vm.createFromCharacterId}
              toCharacterId={vm.createToCharacterId}
              relationshipName={vm.createRelationshipName}
              onFromCharacterChange={vm.onCreateFromCharacterChange}
              onToCharacterChange={vm.onCreateToCharacterChange}
              onRelationshipNameChange={vm.onCreateRelationshipNameChange}
              onSubmit={vm.onCreateSubmit}
              onCancel={vm.onCloseCreateModal}
              submitLabel="追加"
              isSubmitting={vm.isSubmitting}
            />
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {vm.isEditModalOpen && vm.editingRelationship && (
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
              関係性を編集
            </h2>
            <RelationshipForm
              characters={vm.characters}
              fromCharacterId={vm.editingRelationship.fromCharacterId}
              toCharacterId={vm.editingRelationship.toCharacterId}
              relationshipName={vm.editRelationshipName}
              onFromCharacterChange={() => {}}
              onToCharacterChange={() => {}}
              onRelationshipNameChange={vm.onEditRelationshipNameChange}
              onSubmit={vm.onEditSubmit}
              onCancel={vm.onCloseEditModal}
              submitLabel="更新"
              isSubmitting={vm.isSubmitting}
              isEditMode
            />
          </div>
        </div>
      )}

      {/* キャラクター作成モーダル */}
      <CharacterCreateModal
        isOpen={vm.isCharacterCreateModalOpen}
        name={vm.createCharacterName}
        description={vm.createCharacterDescription}
        isSubmitting={vm.isSubmitting}
        onClose={vm.onCloseCharacterCreateModal}
        onNameChange={vm.onCreateCharacterNameChange}
        onDescriptionChange={vm.onCreateCharacterDescriptionChange}
        onSubmit={vm.onCharacterCreateSubmit}
      />

      {/* 削除確認モーダル */}
      {vm.isDeleteModalOpen && vm.deletingRelationship && (
        <DeleteRelationshipModal
          relationship={vm.deletingRelationship}
          characters={vm.characters}
          onConfirm={vm.onDeleteConfirm}
          onCancel={vm.onCloseDeleteModal}
          isDeleting={vm.isDeleting}
        />
      )}
    </div>
  );
};
