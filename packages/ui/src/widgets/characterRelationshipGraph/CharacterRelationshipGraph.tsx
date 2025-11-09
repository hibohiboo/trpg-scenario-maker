import cytoscape, { type Core, type LayoutOptions } from 'cytoscape';
import { useCallback, useEffect, useRef } from 'react';
import { CharacterGraphToolbar } from './CharacterGraphToolbar';
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
}: CharacterRelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Cytoscapeインスタンスの初期化と更新
  useEffect(() => {
    if (!containerRef.current || characters.length === 0) {
      return undefined;
    }

    // 既存のインスタンスを破棄
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // ノードデータの作成
    const nodes = characters.map((character) => ({
      data: {
        id: character.characterId,
        label: character.name,
        role: character.role,
        description: character.description,
      },
    }));

    // キャラクターIDのセットを作成（存在チェック用）
    const characterIds = new Set(characters.map((c) => c.characterId));

    // エッジデータの作成（存在するノード間のみ）
    const edges = relations
      .filter(
        (relation) =>
          characterIds.has(relation.fromCharacterId) &&
          characterIds.has(relation.toCharacterId),
      )
      .map((relation, index) => ({
        data: {
          id: `edge-${index}`,
          source: relation.fromCharacterId,
          target: relation.toCharacterId,
          label: relation.relationshipName,
        },
      }));

    // Cytoscapeインスタンスを作成
    const cy = cytoscape({
      container: containerRef.current,
      elements: {
        nodes,
        edges,
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#ffffff',
            'border-width': 2,
            'border-color': '#3b82f6',
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            color: '#1f2937',
            'font-size': '14px',
            'font-weight': 'bold',
            width: 120,
            height: 80,
            shape: 'roundrectangle',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
          },
        },
        {
          selector: 'node:hover',
          style: {
            'border-color': '#2563eb',
            'border-width': 3,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#3b82f6',
            'target-arrow-color': '#3b82f6',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': '12px',
            color: '#1e40af',
            'text-background-color': '#eff6ff',
            'text-background-opacity': 1,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle',
          },
        },
        {
          selector: 'edge:hover',
          style: {
            width: 3,
            'line-color': '#2563eb',
            'target-arrow-color': '#2563eb',
          },
        },
        {
          selector: 'edge.selected',
          style: {
            width: 3,
            'line-color': '#ef4444',
            'target-arrow-color': '#ef4444',
          },
        },
      ],
      layout: {
        name: 'cose',
        padding: 50,
      } as LayoutOptions,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      wheelSensitivity: 0.2,
    });

    // エッジクリックでselectedクラスをトグル
    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      if (edge.hasClass('selected')) {
        edge.removeClass('selected');
      } else {
        cy.$('edge').removeClass('selected');
        edge.addClass('selected');
      }
    });

    // 背景クリックで選択解除
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.$('edge').removeClass('selected');
      }
    });

    cyRef.current = cy;

    // クリーンアップ
    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [characters, relations]);

  // レイアウト変更ハンドラー
  const onLayout = useCallback((layoutName: string) => {
    if (!cyRef.current) return;

    if (layoutName === 'cose') {
      cyRef.current
        .layout({
          name: 'cose',
          padding: 50,
          nodeRepulsion: 8000,
          idealEdgeLength: 100,
          edgeElasticity: 100,
        } as LayoutOptions)
        .run();
    } else if (layoutName === 'breadthfirst') {
      cyRef.current
        .layout({
          name: 'breadthfirst',
          padding: 50,
          directed: true,
          spacingFactor: 1.5,
        } as LayoutOptions)
        .run();
    } else if (layoutName === 'circle') {
      cyRef.current
        .layout({
          name: 'circle',
          padding: 50,
          spacingFactor: 1.5,
        } as LayoutOptions)
        .run();
    } else {
      cyRef.current
        .layout({
          name: layoutName,
          padding: 50,
        } as LayoutOptions)
        .run();
    }
  }, []);

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
