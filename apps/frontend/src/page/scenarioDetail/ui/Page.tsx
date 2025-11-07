import { useParams } from 'react-router';
import { CharacterTabContent } from '@/feature/scenarioCharacterManagement';
import {
  InformationItemTabContent,
  useInformationManagement,
} from '@/feature/scenarioInformationManagement';
import { SceneTabContent } from '@/feature/scenarioSceneManagement';
import { useAppSelector, useAppDispatch } from '@/shared/lib/store';
import { TabNavigationBar, type TabItem } from '@/widget/TabNavigationBar';
import {
  scenarioDetailCurrentTabSelector,
  setScenarioDetailCurrentTab,
} from '../models/scenarioDetailSlice';

/**
 * シナリオ詳細ページ
 *
 * シーン、キャラクター、情報項目の3つのタブを持つページ
 */
export default function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error('シナリオIDが見つかりません');

  const dispatch = useAppDispatch();
  const currentTab = useAppSelector(scenarioDetailCurrentTabSelector);

  const { handleAddSceneInformation, handleRemoveSceneInformation } =
    useInformationManagement();

  const tabItems: TabItem[] = [
    { id: 'シーン', label: 'シーン' },
    { id: 'キャラクター', label: 'キャラクター' },
    { id: '情報項目', label: '情報項目' },
  ];

  const handleTabChange = (tab: string) => {
    dispatch(setScenarioDetailCurrentTab(tab));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">シナリオ編集</h1>

      <TabNavigationBar
        items={tabItems}
        currentTab={currentTab}
        onTabChange={handleTabChange}
      />

      {currentTab === 'シーン' && (
        <SceneTabContent
          scenarioId={id}
          onAddSceneInformation={handleAddSceneInformation}
          onRemoveSceneInformation={handleRemoveSceneInformation}
        />
      )}
      {currentTab === 'キャラクター' && <CharacterTabContent scenarioId={id} />}
      {currentTab === '情報項目' && (
        <InformationItemTabContent scenarioId={id} />
      )}
    </div>
  );
}
