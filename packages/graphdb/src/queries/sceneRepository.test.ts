import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  initializeWebDatabase,
  initializeWebConnection,
} from '../../tests/mock/helper.mjs';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { scenarioGraphRepository } from './scenarioRepository';
import { sceneGraphRepository } from './sceneRepository';

vi.mock('@kuzu/kuzu-wasm', async () => {
  const { default: originalModule } = (await vi.importActual(
    '@kuzu/kuzu-wasm',
  )) as any;
  return {
    default: async () => {
      const m = await originalModule();
      const Database = () => initializeWebDatabase(m);
      const Connection = (...args: [any, number]) =>
        initializeWebConnection(m, ...args);
      return {
        ...m,
        Database,
        Connection,
      };
    },
  };
});
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

      const [target] = result as any;
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
      const [target] = result as any;
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

      const [target] = result as any;
      expect(result).toHaveLength(1);
      expect(target.description).toBe(specialDescription);
    });
  });
});
