/**
 * Coseレイアウト（力学ベースの自動配置）
 */
export const coseLayout = {
  name: 'cose',
  padding: 50,
  nodeRepulsion: 8000,
  idealEdgeLength: 100,
  edgeElasticity: 100,
};

/**
 * Breadthfirstレイアウト（階層表示）
 */
export const breadthfirstLayout = {
  name: 'breadthfirst',
  padding: 50,
  directed: true,
  spacingFactor: 1.5,
};

/**
 * Circleレイアウト（円形配置）
 */
export const circleLayout = {
  name: 'circle',
  padding: 50,
  spacingFactor: 1.5,
};

/**
 * デフォルトレイアウト（初期表示用）
 */
export const defaultLayout = {
  name: 'cose',
  padding: 50,
};

/**
 * レイアウト名からレイアウト設定を取得
 */
export function getLayoutOptions(layoutName: string) {
  switch (layoutName) {
    case 'cose':
      return coseLayout;
    case 'breadthfirst':
      return breadthfirstLayout;
    case 'circle':
      return circleLayout;
    default:
      return { name: layoutName, padding: 50 };
  }
}
