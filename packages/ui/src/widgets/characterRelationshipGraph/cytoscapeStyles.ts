/**
 * Cytoscape.jsのノードとエッジのスタイル定義
 */
export const cytoscapeStylesheet = [
  // ノードの基本スタイル
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
  } as const,
  // ノードのホバースタイル
  {
    selector: 'node:hover',
    style: {
      'border-color': '#2563eb',
      'border-width': 3,
    },
  } as const,
  // エッジの基本スタイル
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
  } as const,
  // エッジのホバースタイル
  {
    selector: 'edge:hover',
    style: {
      width: 3,
      'line-color': '#2563eb',
      'target-arrow-color': '#2563eb',
    },
  } as const,
  // エッジの選択スタイル
  {
    selector: 'edge.selected',
    style: {
      width: 3,
      'line-color': '#ef4444',
      'target-arrow-color': '#ef4444',
    },
  } as const,
];
