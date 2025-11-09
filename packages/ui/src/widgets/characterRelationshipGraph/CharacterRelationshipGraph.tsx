import { useCallback, useRef } from 'react';
import { CharacterGraphToolbar } from './CharacterGraphToolbar';
import { getLayoutOptions } from './cytoscapeLayouts';
import { useCytoscapeGraph } from './useCytoscapeGraph';
import type {
  CharacterWithRole,
  ScenarioCharacterRelationship,
} from '../../features/scenarioCharacterManagement';

export interface CharacterRelationshipGraphProps {
  /** キャラクター一覧 */
  characters: CharacterWithRole[];
  /** 関係性一覧 */
  relations: ScenarioCharacterRelationship[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** キャラクターIDごとのメイン画像URL */
  characterImages?: Record<string, string | null>;
}

/**
 * キャラクター関係性グラフコンポーネント
 * Cytoscape.jsを使用してキャラクター間の関係性を可視化
 * 相互関係のエッジは自動的にカーブして表示される
 */
export function CharacterRelationshipGraph({
  characters,
  relations,
  isLoading,
  characterImages = {},
}: CharacterRelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useCytoscapeGraph(
    containerRef,
    characters,
    relations,
    characterImages,
  );

  // レイアウト変更ハンドラー
  const onLayout = useCallback(
    (layoutName: string) => {
      if (!cyRef.current) return;

      const layoutOptions = getLayoutOptions(layoutName);
      cyRef.current.layout(layoutOptions).run();
    },
    [cyRef],
  );

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">キャラクターが登録されていません</p>
          <p className="text-sm">
            キャラクターを追加して関係性を可視化しましょう
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden relative">
      <CharacterGraphToolbar onLayout={onLayout} />
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
