import { describe, it, expect } from 'vitest';
import { parseSceneEventSchema } from './sceneEvent';
import type { SceneEvent, SceneEventType } from './sceneEvent';

describe('SceneEvent Schema', () => {
  describe('parseSceneEventSchema', () => {
    it('正常なSceneEventオブジェクトをパースできる', () => {
      const validEvent = {
        id: 'event-1',
        type: 'start',
        content: 'シーン開始',
        sortOrder: 0,
      };

      const result = parseSceneEventSchema(validEvent);

      expect(result).toEqual(validEvent);
    });

    it('全てのイベントタイプを受け付ける', () => {
      // 網羅性テスト: SceneEventTypeの全ケースをテストして型定義との整合性を保証
      const eventTypes: SceneEventType[] = [
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

      eventTypes.forEach((type, index) => {
        const event = {
          id: `event-${index}`,
          type,
          content: `${type}イベント`,
          sortOrder: index,
        };

        const result = parseSceneEventSchema(event);

        expect(result.type).toBe(type);
      });
    });

    it.each([
      { sortOrder: 0, description: '0' },
      { sortOrder: 1, description: '1' },
      { sortOrder: 10, description: '10' },
      { sortOrder: 100, description: '100' },
    ])('sortOrderが$descriptionの場合は成功', ({ sortOrder }) => {
      const event = {
        id: 'event-1',
        type: 'start' as SceneEventType,
        content: 'テスト',
        sortOrder,
      };

      expect(() => parseSceneEventSchema(event)).not.toThrow();
    });

    it('idが文字列でない場合はエラー', () => {
      const invalidEvent = {
        id: 123,
        type: 'start',
        content: 'テスト',
        sortOrder: 0,
      };

      expect(() => parseSceneEventSchema(invalidEvent)).toThrow();
    });

    it('typeが不正な値の場合はエラー', () => {
      const invalidEvent = {
        id: 'event-1',
        type: 'invalid-type',
        content: 'テスト',
        sortOrder: 0,
      };

      expect(() => parseSceneEventSchema(invalidEvent)).toThrow();
    });

    it('contentが文字列でない場合はエラー', () => {
      const invalidEvent = {
        id: 'event-1',
        type: 'start',
        content: 123,
        sortOrder: 0,
      };

      expect(() => parseSceneEventSchema(invalidEvent)).toThrow();
    });

    it('sortOrderが負の数の場合はエラー', () => {
      const invalidEvent = {
        id: 'event-1',
        type: 'start',
        content: 'テスト',
        sortOrder: -1,
      };

      expect(() => parseSceneEventSchema(invalidEvent)).toThrow();
    });

    it('sortOrderが整数でない場合はエラー', () => {
      const invalidEvent = {
        id: 'event-1',
        type: 'start',
        content: 'テスト',
        sortOrder: 1.5,
      };

      expect(() => parseSceneEventSchema(invalidEvent)).toThrow();
    });

    it('必須フィールドが欠けている場合はエラー', () => {
      const incompleteEvent = {
        id: 'event-1',
        type: 'start',
        // content が欠けている
        sortOrder: 0,
      };

      expect(() => parseSceneEventSchema(incompleteEvent)).toThrow();
    });

    it('空文字列のcontentは許可される', () => {
      const event = {
        id: 'event-1',
        type: 'start',
        content: '',
        sortOrder: 0,
      };

      expect(() => parseSceneEventSchema(event)).not.toThrow();
    });

    it('nullやundefinedはエラー', () => {
      expect(() => parseSceneEventSchema(null)).toThrow();
      expect(() => parseSceneEventSchema(undefined)).toThrow();
    });

    it('追加のプロパティがあっても許可される', () => {
      const eventWithExtra = {
        id: 'event-1',
        type: 'start',
        content: 'テスト',
        sortOrder: 0,
        extraField: 'extra value',
      };

      // Valibotはデフォルトで追加プロパティを許可する
      expect(() => parseSceneEventSchema(eventWithExtra)).not.toThrow();
    });
  });

  describe('SceneEventType', () => {
    it('全てのイベントタイプが定義されている', () => {
      const expectedTypes: SceneEventType[] = [
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

      expectedTypes.forEach((type) => {
        const event = {
          id: 'event-1',
          type,
          content: 'テスト',
          sortOrder: 0,
        };

        expect(() => parseSceneEventSchema(event)).not.toThrow();
      });
    });
  });

  describe('実際のユースケース', () => {
    it('戦闘イベントの例', () => {
      const battleEvent: SceneEvent = {
        id: 'battle-001',
        type: 'battle',
        content: 'ドラゴンとの戦闘',
        sortOrder: 0,
      };

      const result = parseSceneEventSchema(battleEvent);

      expect(result).toEqual(battleEvent);
    });

    it('会話イベントの例', () => {
      const conversationEvent: SceneEvent = {
        id: 'conv-001',
        type: 'conversation',
        content: 'マスターとの会話：依頼内容を聞く',
        sortOrder: 1,
      };

      const result = parseSceneEventSchema(conversationEvent);

      expect(result).toEqual(conversationEvent);
    });

    it('選択肢イベントの例', () => {
      const choiceEvent: SceneEvent = {
        id: 'choice-001',
        type: 'choice',
        content: '依頼を受けるか断るか',
        sortOrder: 2,
      };

      const result = parseSceneEventSchema(choiceEvent);

      expect(result).toEqual(choiceEvent);
    });

    it('複数イベントの順序管理', () => {
      const events: SceneEvent[] = [
        {
          id: 'e1',
          type: 'start',
          content: 'シーン開始',
          sortOrder: 0,
        },
        {
          id: 'e2',
          type: 'conversation',
          content: '会話',
          sortOrder: 1,
        },
        {
          id: 'e3',
          type: 'battle',
          content: '戦闘',
          sortOrder: 2,
        },
        {
          id: 'e4',
          type: 'ending',
          content: '終了',
          sortOrder: 3,
        },
      ];

      events.forEach((event) => {
        expect(() => parseSceneEventSchema(event)).not.toThrow();
      });

      // 順序が正しいか確認
      expect(events[0].sortOrder).toBeLessThan(events[1].sortOrder);
      expect(events[1].sortOrder).toBeLessThan(events[2].sortOrder);
      expect(events[2].sortOrder).toBeLessThan(events[3].sortOrder);
    });
  });
});
