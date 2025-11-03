import {
  ScenarioCharacterList,
  ScenarioCharacterRelationshipList,
  ScenarioCharacterRelationshipFormModal,
  ScenarioCharacterFormModal,
  ScenarioCharacterEditModal,
  CharacterRelationshipGraph,
} from '@trpg-scenario-maker/ui';
import type { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';

type CharacterTabContentProps = Pick<
  ReturnType<typeof useScenarioDetailPage>,
  | 'characters'
  | 'isCharactersLoading'
  | 'handleCharacterClick'
  | 'handleRemoveCharacter'
  | 'isCharacterFormOpen'
  | 'handleOpenCharacterForm'
  | 'handleCloseCharacterForm'
  | 'handleCreateNewCharacter'
  | 'isCharacterEditOpen'
  | 'editingCharacter'
  | 'handleOpenEditCharacter'
  | 'handleCloseEditCharacter'
  | 'handleUpdateCharacter'
  | 'handleAddExistingCharacter'
  | 'characterRelations'
  | 'isRelationsLoading'
  | 'isRelationshipFormOpen'
  | 'handleAddRelationship'
  | 'handleCloseRelationshipForm'
  | 'handleSubmitRelationship'
  | 'handleRemoveRelationship'
>;

export function CharacterTabContent({
  characters,
  isCharactersLoading,
  handleCharacterClick,
  handleRemoveCharacter,
  isCharacterFormOpen,
  handleOpenCharacterForm,
  handleCloseCharacterForm,
  handleCreateNewCharacter,
  isCharacterEditOpen,
  editingCharacter,
  handleOpenEditCharacter,
  handleCloseEditCharacter,
  handleUpdateCharacter,
  handleAddExistingCharacter,
  characterRelations,
  isRelationsLoading,
  isRelationshipFormOpen,
  handleAddRelationship,
  handleCloseRelationshipForm,
  handleSubmitRelationship,
  handleRemoveRelationship,
}: CharacterTabContentProps) {
  return (
    <>
      <div className="space-y-8">
        {/* キャラクター一覧と関係性リスト */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-5">
            <ScenarioCharacterList
              characters={characters}
              isLoading={isCharactersLoading}
              onCharacterClick={handleCharacterClick}
              onEditCharacter={handleOpenEditCharacter}
              onRemoveCharacter={handleRemoveCharacter}
              onCreateNew={handleOpenCharacterForm}
              onAddExisting={handleAddExistingCharacter}
            />
          </section>

          <section className="lg:col-span-7">
            <ScenarioCharacterRelationshipList
              relations={characterRelations}
              isLoading={isRelationsLoading}
              onAddRelationship={handleAddRelationship}
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
      />
      <ScenarioCharacterRelationshipFormModal
        isOpen={isRelationshipFormOpen}
        characters={characters}
        onClose={handleCloseRelationshipForm}
        onSubmit={handleSubmitRelationship}
      />
    </>
  );
}
