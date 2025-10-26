/**
 * Cypherクエリ用の文字列エスケープ
 * シングルクォート、改行、制御文字をエスケープ
 */
export const escapeCypherString = (str: string): string =>
  str
    .replace(/\\/g, '\\\\') // バックスラッシュ
    .replace(/'/g, "\\'") // シングルクォート
    .replace(/\n/g, '\\\\n') // 改行
    .replace(/\r/g, '\\r') // キャリッジリターン
    .replace(/\t/g, '\\t'); // タブ
