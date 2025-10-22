# TRPG Scenario Maker

TRPGシナリオを可視化しながら作成できるWebアプリケーション

https://hibohiboo.github.io/trpg-scenario-maker/

## 概要

TRPG Scenario Makerは、TRPGのシナリオ作成を支援するフロントエンドアプリケーションです。シナリオの構造を視覚的に整理し、キャラクター・場所・イベントなどの要素を関連付けながら、効率的にシナリオを組み立てることができます。

### 特徴

- **ビジュアルエディタ**: シナリオの流れをフローチャートやマインドマップのように可視化
- **要素管理**: キャラクター、場所、アイテム、イベントなどを一元管理
- **オフライン動作**: バックエンド不要、ブラウザのみで完結
- **データ保存**: ローカルストレージ
- **GitHub Pages対応**: 無料で公開・共有可能

## 技術スタック

- **パッケージマネージャ**: Bun 1.3.1+
- **ビルドツール**: Turbo (monorepo管理)
- **テストフレームワーク**: Vitest
- **デプロイ先**: GitHub Pages

## プロジェクト構成

```
trpg-scenario-maker/
├── apps/           # アプリケーション（フロントエンド）
├── packages/       # 共通ライブラリ・コンポーネント
├── package.json    # ルートパッケージ設定
├── turbo.json      # Turboビルド設定
└── readme.md       # このファイル
```

## セットアップ

### 前提条件

- [Bun](https://bun.sh/) 1.3.1以上

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/trpg-scenario-maker.git
cd trpg-scenario-maker

# 依存関係のインストール
bun install
```

## 開発

### 開発サーバーの起動

```bash
bun run dev
```

### ビルド

```bash
bun run build
```

### リント

```bash
bun run lint
```

### テスト実行

```bash
bun run test
```

### 依存関係の更新

```bash
bun run ncu
```

## デプロイ

このプロジェクトはGitHub Pagesでの公開を想定しています。

1. GitHub Actionsワークフローを設定（`.github/workflows/deploy.yml`）
2. リポジトリ設定でGitHub Pagesを有効化
3. `main`ブランチへのプッシュで自動デプロイ

## ライセンス

MIT

## 貢献

Issue報告やPull Requestを歓迎します。

## ロードマップ

- [ ] 基本的なシナリオエディタUI
- [ ] キャラクター・場所・アイテム管理機能
- [ ] シナリオフロー可視化機能
- [ ] データのエクスポート/インポート
- [ ] テンプレート機能
- [ ] GitHub Pages公開設定
