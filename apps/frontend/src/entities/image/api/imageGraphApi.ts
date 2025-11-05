import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

/**
 * 画像グラフDB API
 * GraphDBWorkerClientを使用して、画像ノードとキャラクター関連の操作を提供
 */
export const imageGraphApi = {
  /**
   * 画像ノードを作成
   */
  async createNode(imageId: string): Promise<{ id: string }> {
    const result = await graphdbWorkerClient.request('image:graph:createNode', {
      imageId,
    });

    return result;
  },

  /**
   * キャラクターに画像を関連付け
   */
  async linkToCharacter(params: {
    characterId: string;
    imageId: string;
    isPrimary: boolean;
  }): Promise<{
    characterId: string;
    imageId: string;
    isPrimary: boolean;
  }> {
    const result = await graphdbWorkerClient.request(
      'image:graph:linkToCharacter',
      params,
    );

    return result;
  },

  /**
   * 画像関連のisPrimaryを更新
   */
  async updateLink(params: {
    characterId: string;
    imageId: string;
    isPrimary: boolean;
  }): Promise<{
    characterId: string;
    imageId: string;
    isPrimary: boolean;
  }> {
    const result = await graphdbWorkerClient.request(
      'image:graph:updateLink',
      params,
    );

    return result;
  },

  /**
   * キャラクターから画像の関連を削除
   */
  async unlinkFromCharacter(params: {
    characterId: string;
    imageId: string;
  }): Promise<void> {
    await graphdbWorkerClient.request(
      'image:graph:unlinkFromCharacter',
      params,
    );
  },

  /**
   * 画像ノードを削除（全関連も削除）
   */
  async deleteNode(imageId: string): Promise<void> {
    await graphdbWorkerClient.request('image:graph:deleteNode', { imageId });
  },

  /**
   * キャラクターの全画像を取得
   */
  async getImagesByCharacterId(
    characterId: string,
  ): Promise<Array<{ imageId: string; isPrimary: boolean }>> {
    const result = await graphdbWorkerClient.request(
      'image:graph:getImagesByCharacterId',
      { characterId },
    );

    return result;
  },

  /**
   * キャラクターのメイン画像を取得
   */
  async getPrimaryImageByCharacterId(
    characterId: string,
  ): Promise<{ imageId: string; isPrimary: boolean } | null> {
    const result = await graphdbWorkerClient.request(
      'image:graph:getPrimaryImageByCharacterId',
      { characterId },
    );

    return result;
  },

  /**
   * 画像を使用しているキャラクターを取得
   */
  async getCharactersByImageId(
    imageId: string,
  ): Promise<
    Array<{ characterId: string; characterName: string; isPrimary: boolean }>
  > {
    const result = await graphdbWorkerClient.request(
      'image:graph:getCharactersByImageId',
      { imageId },
    );

    return result;
  },

  /**
   * IDで画像ノードを取得
   */
  async getNodeById(imageId: string): Promise<{ id: string } | null> {
    const result = await graphdbWorkerClient.request(
      'image:graph:getNodeById',
      {
        imageId,
      },
    );

    return result;
  },

  /**
   * 全画像ノードを取得
   */
  async getAllNodes(): Promise<Array<{ id: string }>> {
    const result = await graphdbWorkerClient.request('image:graph:getAllNodes');

    return result;
  },
} as const;
