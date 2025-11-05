export default {
  paths: ['**/features/character-image.feature'],
  import: ['**/steps/*.steps.ts'],
  loader: ['ts-node/esm'],
  format: [
    'summary',
    'progress-bar', // 実行時にプログレスバーをログ表示する設定
    'html:./dist/cucumber-report/index.html', // テスト結果をHTMLファイルで出力する設定
  ],
};
