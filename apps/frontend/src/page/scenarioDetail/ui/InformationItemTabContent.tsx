import {
  InformationItemList,
  InformationItemForm,
  InformationItemConnectionList,
  InformationItemConnectionFormModal,
  type InformationItemConnectionDisplay,
} from '@trpg-scenario-maker/ui';
import { useMemo } from 'react';
import type { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';

type InformationItemTabContentProps = Pick<
  ReturnType<typeof useScenarioDetailPage>,
  | 'informationItems'
  | 'informationConnections'
  | 'isInformationItemsLoading'
  | 'isInformationItemFormOpen'
  | 'editingInformationItem'
  | 'handleOpenInformationItemForm'
  | 'handleCloseInformationItemForm'
  | 'handleCreateInformationItem'
  | 'handleUpdateInformationItem'
  | 'handleDeleteInformationItem'
  | 'handleEditInformationItem'
  | 'isInformationConnectionModalOpen'
  | 'handleOpenInformationConnectionModal'
  | 'handleCloseInformationConnectionModal'
  | 'handleCreateInformationConnection'
  | 'handleRemoveInformationConnection'
>;

export function InformationItemTabContent({
  informationItems,
  informationConnections,
  isInformationItemsLoading,
  isInformationItemFormOpen,
  editingInformationItem,
  handleOpenInformationItemForm,
  handleCloseInformationItemForm,
  handleCreateInformationItem,
  handleUpdateInformationItem,
  handleDeleteInformationItem,
  handleEditInformationItem,
  isInformationConnectionModalOpen,
  handleOpenInformationConnectionModal,
  handleCloseInformationConnectionModal,
  handleCreateInformationConnection,
  handleRemoveInformationConnection,
}: InformationItemTabContentProps) {
  // 接続データを表示用に変換
  const connectionDisplays: InformationItemConnectionDisplay[] = useMemo(
    () =>
      informationConnections.map((conn) => {
        const sourceItem = informationItems.find(
          (item) => item.id === conn.source,
        );
        const targetItem = informationItems.find(
          (item) => item.id === conn.target,
        );
        return {
          id: conn.id,
          source: conn.source,
          target: conn.target,
          sourceName: sourceItem?.title || '不明',
          targetName: targetItem?.title || '不明',
        };
      }),
    [informationConnections, informationItems],
  );
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <InformationItemList
            items={informationItems}
            isLoading={isInformationItemsLoading}
            onItemClick={handleEditInformationItem}
            onEdit={handleEditInformationItem}
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
                      handleUpdateInformationItem(
                        editingInformationItem.id,
                        data,
                      )
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

      <section>
        <InformationItemConnectionList
          items={informationItems}
          connections={connectionDisplays}
          isLoading={isInformationItemsLoading}
          onAddConnection={handleOpenInformationConnectionModal}
          onRemoveConnection={handleRemoveInformationConnection}
        />
      </section>

      <InformationItemConnectionFormModal
        isOpen={isInformationConnectionModalOpen}
        items={informationItems}
        onClose={handleCloseInformationConnectionModal}
        onSubmit={handleCreateInformationConnection}
      />
    </div>
  );
}
