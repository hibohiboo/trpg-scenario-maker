import {
  parseSceneListSchema,
  parseSceneConnectionListSchema,
} from '@trpg-scenario-maker/schema';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { scenarioGraphRepository } from './scenarioRepository';
import { sceneGraphRepository } from './sceneRepository';

describe('sceneGraphRepositoryでescapeCypherStringを通してマークダウンがパースできるかのテスト', () => {
  beforeAll(async () => {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  });

  afterAll(async () => {
    await closeDatabase();
  });
  it('シナリオを作成できる', async () => {
    // テスト用シナリオを作成
    const scenarioId = uuidv4();
    const result = await scenarioGraphRepository.create({
      id: scenarioId,
      title: 'テストシナリオ',
    });

    expect(result).toEqual({
      id: scenarioId,
      title: 'テストシナリオ',
      _ID: {
        offset: '0',
        table: '0',
      },
      _LABEL: 'Scenario',
    });
  });
  describe('改行文字を含むマークダウンのテスト', () => {
    it('改行文字を含むdescriptionでシーンを作成できる', async () => {
      // テスト用シナリオを作成
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      // マークダウンを含むシーンを作成
      const sceneId = uuidv4();
      const markdownDescription = `# 見出し

## サブ見出し

これは改行を含むマークダウンです。

- リスト1
- リスト2
- リスト3

**太字**や*斜体*も使えます。`;

      const result = await sceneGraphRepository.createScene({
        scenarioId,
        id: sceneId,
        title: 'テストシーン',
        description: markdownDescription,
        isMasterScene: false,
      });

      const [target] = parseSceneListSchema(result);
      expect(result).toHaveLength(1);
      expect(target?.id).toBe(sceneId);
      expect(target?.title).toBe('テストシーン');
      expect(target?.description).toBe(markdownDescription);
    });

    it('改行文字を含むdescriptionでシーンを更新できる', async () => {
      // テスト用シナリオとシーンを作成
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      const sceneId = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: sceneId,
        title: '初期シーン',
        description: '初期の説明',
        isMasterScene: false,
      });

      // マークダウンを含む説明に更新
      const updatedMarkdown = `# 更新された見出し

改行を含む
複数行の
テキスト

\`\`\`javascript
const code = "example";
\`\`\``;

      const result = await sceneGraphRepository.updateScene({
        id: sceneId,
        description: updatedMarkdown,
      });
      const [target] = parseSceneListSchema(result);
      expect(result).toHaveLength(1);
      expect(target.id).toBe(sceneId);
      expect(target.description).toBe(updatedMarkdown);
    });

    it('シングルクォートとバックスラッシュを含むテキストを扱える', async () => {
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      const sceneId = uuidv4();
      const specialDescription = `It's a test with 'quotes' and backslash: \\
And multiple lines
With special chars: \t\r\n`;

      const result = await sceneGraphRepository.createScene({
        scenarioId,
        id: sceneId,
        title: "Scene with 'quotes'",
        description: specialDescription,
        isMasterScene: false,
      });

      const [target] = parseSceneListSchema(result);
      expect(result).toHaveLength(1);
      expect(target.description).toBe(specialDescription);
    });

    it('descriptionが空文字列でシーンを作成できる', async () => {
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      const sceneId = uuidv4();
      const result = await sceneGraphRepository.createScene({
        scenarioId,
        id: sceneId,
        title: 'テストシーン',
        description: '',
        isMasterScene: false,
      });

      const [target] = parseSceneListSchema(result);
      expect(result).toHaveLength(1);
      expect(target?.id).toBe(sceneId);
      expect(target?.title).toBe('テストシーン');
      expect(target?.description).toBe('');
    });

    it('descriptionが空文字列でシーンを更新できる', async () => {
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      const sceneId = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: sceneId,
        title: '初期シーン',
        description: '初期の説明',
        isMasterScene: false,
      });

      const result = await sceneGraphRepository.updateScene({
        id: sceneId,
        description: '',
      });

      const [target] = parseSceneListSchema(result);
      expect(result).toHaveLength(1);
      expect(target.id).toBe(sceneId);
      expect(target.description).toBe('');
    });

    it('getScenesByScenarioIdで空のdescriptionを持つシーンを取得できる', async () => {
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      // 空のdescriptionを持つシーンを作成
      const sceneId1 = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: sceneId1,
        title: 'シーン1',
        description: '',
        isMasterScene: false,
      });

      // 通常のdescriptionを持つシーンを作成
      const sceneId2 = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: sceneId2,
        title: 'シーン2',
        description: 'これは通常の説明です',
        isMasterScene: false,
      });

      // getScenesByScenarioIdで取得
      const result =
        await sceneGraphRepository.getScenesByScenarioId(scenarioId);
      const scenes = parseSceneListSchema(result);

      expect(scenes).toHaveLength(2);

      const scene1 = scenes.find((s) => s.id === sceneId1);
      const scene2 = scenes.find((s) => s.id === sceneId2);

      expect(scene1?.description).toBe('');
      expect(scene2?.description).toBe('これは通常の説明です');
    });
  });

  describe('シーン接続のテスト', () => {
    it('createConnectionでsourceとtargetのidが|で結合されたidが取得される', async () => {
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      // 2つのシーンを作成
      const sourceSceneId = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: sourceSceneId,
        title: 'ソースシーン',
        description: 'ソースの説明',
        isMasterScene: false,
      });

      const targetSceneId = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: targetSceneId,
        title: 'ターゲットシーン',
        description: 'ターゲットの説明',
        isMasterScene: false,
      });

      // 接続を作成
      const result = await sceneGraphRepository.createConnection({
        source: sourceSceneId,
        target: targetSceneId,
      });

      const connections = parseSceneConnectionListSchema(result);
      expect(connections).toHaveLength(1);

      const connection = connections[0];
      // idが"source|target"の形式になっていることを確認
      expect(connection.id).toBe(`${sourceSceneId}|${targetSceneId}`);
      expect(connection.source).toBe(sourceSceneId);
      expect(connection.target).toBe(targetSceneId);
    });

    it('getConnectionsByScenarioIdで接続一覧を取得できる', async () => {
      const scenarioId = uuidv4();
      await scenarioGraphRepository.create({
        id: scenarioId,
        title: 'テストシナリオ',
      });

      // 3つのシーンを作成
      const scene1Id = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: scene1Id,
        title: 'シーン1',
        description: '',
        isMasterScene: false,
      });

      const scene2Id = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: scene2Id,
        title: 'シーン2',
        description: '',
        isMasterScene: false,
      });

      const scene3Id = uuidv4();
      await sceneGraphRepository.createScene({
        scenarioId,
        id: scene3Id,
        title: 'シーン3',
        description: '',
        isMasterScene: false,
      });

      // 接続を作成
      await sceneGraphRepository.createConnection({
        source: scene1Id,
        target: scene2Id,
      });

      await sceneGraphRepository.createConnection({
        source: scene2Id,
        target: scene3Id,
      });

      // 接続一覧を取得
      const result =
        await sceneGraphRepository.getConnectionsByScenarioId(scenarioId);
      const connections = parseSceneConnectionListSchema(result);

      expect(connections).toHaveLength(2);

      const connection1 = connections.find((c) => c.source === scene1Id);
      const connection2 = connections.find((c) => c.source === scene2Id);

      expect(connection1?.id).toBe(`${scene1Id}|${scene2Id}`);
      expect(connection1?.target).toBe(scene2Id);

      expect(connection2?.id).toBe(`${scene2Id}|${scene3Id}`);
      expect(connection2?.target).toBe(scene3Id);
    });
  });
});
