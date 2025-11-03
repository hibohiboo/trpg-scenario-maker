import { InformationItemList, InformationItemForm } from '@trpg-scenario-maker/ui';
import type { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';

type InformationItemTabContentProps = Pick<
  ReturnType<typeof useScenarioDetailPage>,
  | 'informationItems'
  | 'isInformationItemsLoading'
  | 'isInformationItemFormOpen'
  | 'editingInformationItem'
  | 'handleOpenInformationItemForm'
  | 'handleCloseInformationItemForm'
  | 'handleCreateInformationItem'
  | 'handleUpdateInformationItem'
  | 'handleDeleteInformationItem'
  | 'handleEditInformationItem'
>;

export function InformationItemTabContent({
  informationItems,
  isInformationItemsLoading,
  isInformationItemFormOpen,
  editingInformationItem,
  handleOpenInformationItemForm,
  handleCloseInformationItemForm,
  handleCreateInformationItem,
  handleUpdateInformationItem,
  handleDeleteInformationItem,
  handleEditInformationItem,
}: InformationItemTabContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section>
        <InformationItemList
          items={informationItems}
          isLoading={isInformationItemsLoading}
          onItemClick={handleEditInformationItem}
          onCreateNew={handleOpenInformationItemForm}
          onDelete={handleDeleteInformationItem}
        />
      </section>
      {isInformationItemFormOpen && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {editingInformationItem ? '情報項目編集' : '情報項目作成'}
          </h2>
          <InformationItemForm
            item={editingInformationItem ?? undefined}
            onSubmit={
              editingInformationItem
                ? (data) =>
                    handleUpdateInformationItem(editingInformationItem.id, data)
                : handleCreateInformationItem
            }
            onCancel={handleCloseInformationItemForm}
            onDelete={
              editingInformationItem ? handleDeleteInformationItem : undefined
            }
          />
        </section>
      )}
    </div>
  );
}
