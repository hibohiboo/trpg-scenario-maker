import cytoscape, { type Core } from 'cytoscape';
import { useEffect, useRef } from 'react';
import { defaultLayout } from './cytoscapeLayouts';
import { cytoscapeStylesheet } from './cytoscapeStyles';
import type {
  CharacterWithRole,
  ScenarioCharacterRelationship,
} from '../../features/scenarioCharacterManagement';

/**
 * キャラクターデータをCytoscapeノードに変換
 */
function convertToNodes(
  characters: CharacterWithRole[],
  characterImages: Record<string, string | null>,
) {
  return characters.map((character) => ({
    data: {
      id: character.characterId,
      label: character.name,
      role: character.role,
      description: character.description,
      imageUrl: characterImages[character.characterId] || null,
    },
  }));
}

/**
 * 関係性データをCytoscapeエッジに変換
 * 存在しないノードへの参照は除外される
 */
function convertToEdges(
  relations: ScenarioCharacterRelationship[],
  characterIds: Set<string>,
) {
  return relations
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
}

/**
 * エッジ選択イベントの設定
 */
function setupEdgeSelection(cy: Core) {
  // エッジクリックで選択状態をトグル
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
}

/**
 * Cytoscapeグラフの初期化と管理を行うカスタムフック
 */
export function useCytoscapeGraph(
  containerRef: React.RefObject<HTMLDivElement | null>,
  characters: CharacterWithRole[],
  relations: ScenarioCharacterRelationship[],
  characterImages: Record<string, string | null> = {},
) {
  const cyRef = useRef<Core | null>(null);

  useEffect(() => {
    if (!containerRef.current || characters.length === 0) {
      return undefined;
    }

    // 既存のインスタンスを破棄
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // データ変換
    const nodes = convertToNodes(characters, characterImages);
    const characterIds = new Set(characters.map((c) => c.characterId));
    const edges = convertToEdges(relations, characterIds);

    // Cytoscapeインスタンスを作成
    const cy = cytoscape({
      container: containerRef.current,
      elements: { nodes, edges },
      style: cytoscapeStylesheet,
      layout: defaultLayout,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      wheelSensitivity: 0.2,
    });

    // イベント設定
    setupEdgeSelection(cy);

    cyRef.current = cy;

    // クリーンアップ
    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [containerRef, characters, relations, characterImages]);

  return cyRef;
}
