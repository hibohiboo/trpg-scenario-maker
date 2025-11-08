import {
  InformationItemList,
  InformationItemFormWithSceneConnection,
  InformationItemConnectionList,
  InformationItemConnectionFormModal,
  type InformationItemConnectionDisplay,
} from '@trpg-scenario-maker/ui';
import { useMemo } from 'react';
import { useSceneList } from '@/entities/scene';
import { useInformationManagement } from '../hooks/useInformationManagement';

interface InformationItemTabContentProps {
  scenarioId?: string;
}

/**
 * 情報項目タブコンテンツ
 *
 * 情報項目の作成・編集・削除、情報項目間の接続、シーンとの接続を行う
 */
export function InformationItemTabContent({
  scenarioId: _scenarioId,
}: InformationItemTabContentProps) {
  const {
    informationItems,
    informationConnections,
    informationToSceneConnections,
    isInformationItemsLoading,
    isInformationItemFormOpen,
    editingInformationItem,
    isInformationConnectionModalOpen,
    handleCreateInformationItem,
    handleUpdateInformationItem,
    handleDeleteInformationItem,
    handleOpenInformationItemForm,
    handleCloseInformationItemForm,
    handleEditInformationItem,
    handleOpenInformationConnectionModal,
    handleCloseInformationConnectionModal,
    handleCreateInformationConnection,
    handleRemoveInformationConnection,
    handleAddInformationToScene,
    handleRemoveInformationToScene,
  } = useInformationManagement();

  // シーンデータの取得（情報項目とシーンの接続表示に使用）
  const { scenes } = useSceneList();

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
    <div className="space-y-8 lg:flex gap-8">
      <div className="grid  grid-cols-1 lg:grid-cols-2 gap-8">
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
            <InformationItemFormWithSceneConnection
              item={editingInformationItem ?? undefined}
              onSubmit={
                editingInformationItem
                  ? (data: { title: string; description: string }) =>
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
              scenes={scenes}
              informationToSceneConnections={informationToSceneConnections}
              onAddSceneConnection={
                editingInformationItem
                  ? (sceneId: string) =>
                      handleAddInformationToScene(
                        editingInformationItem.id,
                        sceneId,
                      )
                  : undefined
              }
              onRemoveSceneConnection={handleRemoveInformationToScene}
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
