import { executeQuery } from '../db';

/**
 * 画像のグラフDB操作リポジトリ
 * 画像データはRDBで管理、GraphDBはノードと関連のみ管理
 */
export const imageGraphRepository = {
  /**
   * 画像ノードを作成
   */
  async createImageNode(imageId: string) {
    return executeQuery(`
      CREATE (i:Image {id: '${imageId}'})
      RETURN i.id AS id
    `);
  },

  /**
   * キャラクターと画像の関連を作成
   */
  async linkImageToCharacter(params: {
    characterId: string;
    imageId: string;
    isPrimary: boolean;
  }) {
    return executeQuery(`
      MATCH (c:Character {id: '${params.characterId}'}), (i:Image {id: '${params.imageId}'})
      CREATE (c)-[r:HAS_IMAGE {isPrimary: ${params.isPrimary}}]->(i)
      RETURN c.id AS characterId, i.id AS imageId, r.isPrimary AS isPrimary
    `);
  },

  /**
   * キャラクターの画像関連を更新（isPrimaryを変更）
   */
  async updateImageLink(params: {
    characterId: string;
    imageId: string;
    isPrimary: boolean;
  }) {
    return executeQuery(`
      MATCH (c:Character {id: '${params.characterId}'})-[r:HAS_IMAGE]->(i:Image {id: '${params.imageId}'})
      SET r.isPrimary = ${params.isPrimary}
      RETURN c.id AS characterId, i.id AS imageId, r.isPrimary AS isPrimary
    `);
  },

  /**
   * キャラクターから画像関連を削除
   */
  async unlinkImageFromCharacter(params: {
    characterId: string;
    imageId: string;
  }) {
    return executeQuery(`
      MATCH (c:Character {id: '${params.characterId}'})-[r:HAS_IMAGE]->(i:Image {id: '${params.imageId}'})
      DELETE r
    `);
  },

  /**
   * 画像ノードを削除（全関連も削除）
   */
  async deleteImageNode(imageId: string) {
    return executeQuery(`
      MATCH (i:Image {id: '${imageId}'})
      DETACH DELETE i
    `);
  },

  /**
   * キャラクターの全画像を取得
   */
  async findImagesByCharacterId(characterId: string) {
    return executeQuery(`
      MATCH (c:Character {id: '${characterId}'})-[r:HAS_IMAGE]->(i:Image)
      RETURN i.id AS imageId, r.isPrimary AS isPrimary
      ORDER BY r.isPrimary DESC
    `);
  },

  /**
   * キャラクターのメイン画像を取得
   */
  async findPrimaryImageByCharacterId(characterId: string) {
    return executeQuery(`
      MATCH (c:Character {id: '${characterId}'})-[r:HAS_IMAGE {isPrimary: true}]->(i:Image)
      RETURN i.id AS imageId, r.isPrimary AS isPrimary
      LIMIT 1
    `);
  },

  /**
   * 画像を使用しているキャラクターを取得
   */
  async findCharactersByImageId(imageId: string) {
    return executeQuery(`
      MATCH (c:Character)-[r:HAS_IMAGE]->(i:Image {id: '${imageId}'})
      RETURN c.id AS characterId, c.name AS characterName, r.isPrimary AS isPrimary
    `);
  },

  /**
   * IDで画像ノードを取得
   */
  async findImageNodeById(imageId: string) {
    return executeQuery(`
      MATCH (i:Image {id: '${imageId}'})
      RETURN i.id AS id
    `);
  },

  /**
   * 全画像ノードを取得
   */
  async findAllImageNodes() {
    return executeQuery(`
      MATCH (i:Image)
      RETURN i.id AS id
    `);
  },
} as const;
