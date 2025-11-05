import { parseSceneEventListSchema } from '@trpg-scenario-maker/schema';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { scenarioGraphRepository } from './scenarioRepository';
import { sceneEventRepository } from './sceneEventRepository';
import { sceneGraphRepository } from './sceneRepository';

const initScene = async () => {
  // テスト用シナリオとシーンを作成
  const scenarioId = generateUUID();
  await scenarioGraphRepository.create({
    id: scenarioId,
    title: 'テストシナリオ',
  });
  const sceneId = generateUUID();
  await sceneGraphRepository.createScene({
    scenarioId,
    id: sceneId,
    title: 'テストシーン',
    description: 'シーンの説明',
    isMasterScene: false,
  });
  return { scenarioId, sceneId };
};

describe('sceneEventRepository', () => {
  beforeAll(async () => {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('createEvent', () => {
    it('イベントを作成できる', async () => {
      const { sceneId } = await initScene();

      // イベントを作成
      const eventId = generateUUID();
      const result = await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'start',
        content: 'シーン開始',
        sortOrder: 0,
      });

      expect(result).toEqual([
        {
          id: eventId,
          type: 'start',
          content: 'シーン開始',
          sortOrder: 0,
        },
      ]);
    });

    it('複数のイベントを順序付きで作成できる', async () => {
      const { sceneId } = await initScene();

      const events = [
        { id: generateUUID(), type: 'start', content: '開始', sortOrder: 0 },
        {
          id: generateUUID(),
          type: 'conversation',
          content: '会話',
          sortOrder: 1,
        },
        { id: generateUUID(), type: 'battle', content: '戦闘', sortOrder: 2 },
      ];

      for (const event of events) {
        await sceneEventRepository.createEvent({
          sceneId,
          ...event,
        });
      }

      // 作成されたイベントを取得
      const result = await sceneEventRepository.getEventsBySceneId(sceneId);

      const exp = parseSceneEventListSchema(result);
      expect(exp).toHaveLength(3);
      expect(exp[0].type).toBe('start');
      expect(exp[1].type).toBe('conversation');
      expect(exp[2].type).toBe('battle');
    });

    it('特殊文字を含むcontentでイベントを作成できる', async () => {
      const { sceneId } = await initScene();

      const eventId = generateUUID();
      const specialContent = `マスターとの会話:
「依頼を受けてくれるか？」
- 選択肢1: 受ける
- 選択肢2: 断る

'シングルクォート'や"ダブルクォート"も含む`;

      const result = await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'conversation',
        content: specialContent,
        sortOrder: 0,
      });

      const [exp] = parseSceneEventListSchema(result);
      expect(exp.content).toBe(specialContent);
    });
  });
  describe('getEventsBySceneId', () => {
    it('シーンに紐づくイベントを取得できる', async () => {
      const { sceneId } = await initScene();
      const eventId = generateUUID();

      await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'treasure',
        content: '宝箱を発見',
        sortOrder: 0,
      });

      const result = await sceneEventRepository.getEventsBySceneId(sceneId);

      const exp = parseSceneEventListSchema(result);
      expect(exp).toHaveLength(1);
      expect(exp[0].id).toBe(eventId);
      expect(exp[0].type).toBe('treasure');
    });

    it('イベントがない場合は空配列を返す', async () => {
      const { sceneId } = await initScene();

      const result = await sceneEventRepository.getEventsBySceneId(sceneId);
      expect(result).toHaveLength(0);
    });

    it('イベントがorder順にソートされて返される', async () => {
      const { sceneId } = await initScene();

      // 順序を逆に作成
      await sceneEventRepository.createEvent({
        sceneId,
        id: generateUUID(),
        type: 'ending',
        content: '終了',
        sortOrder: 2,
      });

      await sceneEventRepository.createEvent({
        sceneId,
        id: generateUUID(),
        type: 'conversation',
        content: '会話',
        sortOrder: 1,
      });

      await sceneEventRepository.createEvent({
        sceneId,
        id: generateUUID(),
        type: 'start',
        content: '開始',
        sortOrder: 0,
      });

      const result = await sceneEventRepository.getEventsBySceneId(sceneId);

      const exp = parseSceneEventListSchema(result);
      expect(exp).toHaveLength(3);
      expect(exp[0].sortOrder).toBe(0);
      expect(exp[1].sortOrder).toBe(1);
      expect(exp[2].sortOrder).toBe(2);
      expect(exp[0].type).toBe('start');
      expect(exp[1].type).toBe('conversation');
      expect(exp[2].type).toBe('ending');
    });
  });
  describe('updateEvent', () => {
    it('イベントのtypeを更新できる', async () => {
      const { sceneId } = await initScene();
      const eventId = generateUUID();
      await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'conversation',
        content: '会話イベント',
        sortOrder: 0,
      });

      const result = await sceneEventRepository.updateEvent({
        id: eventId,
        type: 'battle',
      });
      const [event] = parseSceneEventListSchema(result);
      expect(event.type).toBe('battle');
      expect(event.content).toBe('会話イベント'); // contentは変更されていない
    });

    it('イベントのcontentを更新できる', async () => {
      const { sceneId } = await initScene();
      const eventId = generateUUID();
      await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'puzzle',
        content: '謎解き',
        sortOrder: 0,
      });

      const updatedContent = '扉の謎解き: 3つのルーンを正しい順序で並べる';
      const result = await sceneEventRepository.updateEvent({
        id: eventId,
        content: updatedContent,
      });

      const [event] = parseSceneEventListSchema(result);
      expect(event.content).toBe(updatedContent);
    });

    it('イベントのorderを更新できる', async () => {
      const { sceneId } = await initScene();
      const eventId = generateUUID();
      await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'rest',
        content: '休息',
        sortOrder: 0,
      });

      const result = await sceneEventRepository.updateEvent({
        id: eventId,
        sortOrder: 5,
      });

      const [event] = parseSceneEventListSchema(result);
      expect(event.sortOrder).toBe(5);
    });

    it('複数フィールドを同時に更新できる', async () => {
      const { sceneId } = await initScene();
      const eventId = generateUUID();
      await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'choice',
        content: '選択',
        sortOrder: 0,
      });

      const result = await sceneEventRepository.updateEvent({
        id: eventId,
        type: 'trap',
        content: '落とし穴の罠',
        sortOrder: 3,
      });

      const [event] = parseSceneEventListSchema(result);
      expect(event.type).toBe('trap');
      expect(event.content).toBe('落とし穴の罠');
      expect(event.sortOrder).toBe(3);
    });
  });
  describe('deleteEvent', () => {
    it('イベントを削除できる', async () => {
      const { sceneId } = await initScene();
      const eventId = generateUUID();
      await sceneEventRepository.createEvent({
        sceneId,
        id: eventId,
        type: 'battle',
        content: '戦闘',
        sortOrder: 0,
      });

      await sceneEventRepository.deleteEvent(eventId);

      const result = await sceneEventRepository.getEventsBySceneId(sceneId);
      expect(result).toHaveLength(0);
    });

    it('複数イベントのうち1つを削除できる', async () => {
      const { sceneId } = await initScene();
      const event1Id = generateUUID();
      const event2Id = generateUUID();
      const event3Id = generateUUID();
      await sceneEventRepository.createEvent({
        sceneId,
        id: event1Id,
        type: 'start',
        content: '開始',
        sortOrder: 0,
      });
      await sceneEventRepository.createEvent({
        sceneId,
        id: event2Id,
        type: 'conversation',
        content: '会話',
        sortOrder: 1,
      });
      await sceneEventRepository.createEvent({
        sceneId,
        id: event3Id,
        type: 'ending',
        content: '終了',
        sortOrder: 2,
      });

      // 中間のイベントを削除
      await sceneEventRepository.deleteEvent(event2Id);

      const result = await sceneEventRepository.getEventsBySceneId(sceneId);
      const exp = parseSceneEventListSchema(result);
      expect(exp).toHaveLength(2);
      expect(exp[0].id).toBe(event1Id);
      expect(exp[1].id).toBe(event3Id);
    });
  });
  describe('updateEventOrder', () => {
    it('複数イベントの順序を一括更新できる', async () => {
      const { sceneId } = await initScene();
      const event1Id = generateUUID();
      const event2Id = generateUUID();
      const event3Id = generateUUID();
      await sceneEventRepository.createEvent({
        sceneId,
        id: event1Id,
        type: 'start',
        content: '開始',
        sortOrder: 1,
      });
      await sceneEventRepository.createEvent({
        sceneId,
        id: event2Id,
        type: 'conversation',
        content: '会話',
        sortOrder: 2,
      });
      await sceneEventRepository.createEvent({
        sceneId,
        id: event3Id,
        type: 'ending',
        content: '終了',
        sortOrder: 3,
      });

      // 順序を入れ替え
      await sceneEventRepository.updateEventOrder([
        { id: event1Id, sortOrder: 3 },
        { id: event2Id, sortOrder: 1 },
        { id: event3Id, sortOrder: 2 },
      ]);

      const result = await sceneEventRepository.getEventsBySceneId(sceneId);

      const exp = parseSceneEventListSchema(result);
      expect(exp[0].id).toBe(event2Id); // sortOrder: 1
      expect(exp[1].id).toBe(event3Id); // sortOrder: 2
      expect(exp[2].id).toBe(event1Id); // sortOrder: 3
    });
  });
  describe('全イベントタイプのテスト', () => {
    it('全9種類のイベントタイプで作成できる', async () => {
      const { sceneId } = await initScene();
      const eventTypes = [
        'start',
        'conversation',
        'choice',
        'battle',
        'treasure',
        'trap',
        'puzzle',
        'rest',
        'ending',
      ];
      for (let i = 0; i < eventTypes.length; i++) {
        await sceneEventRepository.createEvent({
          sceneId,
          id: generateUUID(),
          type: eventTypes[i],
          content: `${eventTypes[i]}イベント`,
          sortOrder: i,
        });
      }

      const result = await sceneEventRepository.getEventsBySceneId(sceneId);

      const exp = parseSceneEventListSchema(result);
      expect(exp).toHaveLength(9);
      exp.forEach((event, index) => {
        expect(event.type).toBe(eventTypes[index]);
      });
    });
  });
});
