import {
  ScenarioCharacterList,
  ScenarioCharacterRelationshipList,
  ScenarioCharacterRelationshipFormModal,
  ScenarioCharacterFormModal,
  ScenarioCharacterEditModal,
  CharacterRelationshipGraph,
} from '@trpg-scenario-maker/ui';
import { CharacterImageManager } from '@/entities/image';
import { useCharacterManagement } from '../hooks/useCharacterManagement';

interface CharacterTabContentProps {
  scenarioId: string;
}

/**
 * キャラクタータブコンテンツ
 *
 * キャラクターの作成・編集・削除、関係性の管理、グラフ表示を行う
 */
export function CharacterTabContent({ scenarioId }: CharacterTabContentProps) {
  const {
    characters,
    characterRelations,
    isCharactersLoading,
    isRelationsLoading,
    isCharacterFormOpen,
    isCharacterEditOpen,
    isRelationshipFormOpen,
    editingCharacter,
    handleCreateNewCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter,
    handleOpenCharacterForm,
    handleCloseCharacterForm,
    handleOpenEditCharacter,
    handleCloseEditCharacter,
    handleSubmitRelationship,
    handleRemoveRelationship,
    handleOpenRelationshipForm,
    handleCloseRelationshipForm,
  } = useCharacterManagement(scenarioId);

  return (
    <>
      <div className="space-y-8">
        {/* キャラクター一覧と関係性リスト */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-5">
            <ScenarioCharacterList
              characters={characters}
              isLoading={isCharactersLoading}
              onEditCharacter={handleOpenEditCharacter}
              onRemoveCharacter={handleRemoveCharacter}
              onCreateNew={handleOpenCharacterForm}
              onAddExisting={undefined}
            />
          </section>

          <section className="lg:col-span-7">
            <ScenarioCharacterRelationshipList
              relations={characterRelations}
              isLoading={isRelationsLoading}
              onAddRelationship={handleOpenRelationshipForm}
              onRemoveRelationship={handleRemoveRelationship}
            />
          </section>
        </div>
        {/* 関係性グラフビュー */}
        <section>
          <h2 className="text-xl font-semibold mb-4">関係性グラフ</h2>
          <CharacterRelationshipGraph
            characters={characters}
            relations={characterRelations}
            isLoading={isCharactersLoading || isRelationsLoading}
          />
        </section>
      </div>
      <ScenarioCharacterFormModal
        isOpen={isCharacterFormOpen}
        onClose={handleCloseCharacterForm}
        onSubmit={handleCreateNewCharacter}
      />
      <ScenarioCharacterEditModal
        isOpen={isCharacterEditOpen}
        character={editingCharacter}
        onClose={handleCloseEditCharacter}
        onSubmit={handleUpdateCharacter}
      >
        {editingCharacter && (
          <CharacterImageManager characterId={editingCharacter.characterId} />
        )}
      </ScenarioCharacterEditModal>
      <ScenarioCharacterRelationshipFormModal
        isOpen={isRelationshipFormOpen}
        characters={characters}
        onClose={handleCloseRelationshipForm}
        onSubmit={handleSubmitRelationship}
      />
    </>
  );
}
