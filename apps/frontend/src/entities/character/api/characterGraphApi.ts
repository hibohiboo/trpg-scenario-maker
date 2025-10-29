import {
  characterGraphRepository,
  initializeDatabase,
  executeQuery,
  graphDbSchemas,
} from '@trpg-scenario-maker/graphdb';
import type { Character } from '@trpg-scenario-maker/schema';

/**
 * キャラクターグラフDB API
 */
export const characterGraphApi = {
  /**
   * データベース初期化
   */
  async initialize(): Promise<void> {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  },

  /**
   * キャラクター一覧を取得
   */
  async getList(): Promise<Character[]> {
    const result = await characterGraphRepository.findAll();
    return result as Character[];
  },

  /**
   * IDでキャラクターを取得
   */
  async getById(id: string): Promise<Character | undefined> {
    const result = await characterGraphRepository.findById(id);
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as Character;
    }
    return undefined;
  },

  /**
   * キャラクターを作成
   */
  async create(params: {
    id: string;
    name: string;
    description: string;
  }): Promise<Character> {
    const result = await characterGraphRepository.create(params);
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as Character;
    }
    throw new Error('Failed to create character');
  },

  /**
   * キャラクターを更新
   */
  async update(params: {
    id: string;
    name: string;
    description: string;
  }): Promise<Character> {
    const result = await characterGraphRepository.update(params);
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as Character;
    }
    throw new Error('Failed to update character');
  },

  /**
   * キャラクターを削除
   */
  async delete(id: string): Promise<void> {
    await characterGraphRepository.delete(id);
  },
} as const;
