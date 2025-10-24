1. src/schema.ts をもとにマイグレーション用のSQLを作成する。

```
bun run generate
```

2. 作成されたファイルに初期データ挿入のSQLを手動で追加する。

3. フロントエンドで実行できるようにJSON形式にコンパイル

```
bun run compile
```
