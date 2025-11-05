import { imageGraphRepository } from '@trpg-scenario-maker/graphdb';

/**
 * 画像のグラフDB操作ハンドラー
 */
export const imageGraphHandlers = [
  {
    type: 'image:graph:createNode',
    handler: async (payload: unknown) => {
      const { imageId } = payload as { imageId: string };
      const result = await imageGraphRepository.createImageNode(imageId);

      return { data: result[0] };
    },
  },
  {
    type: 'image:graph:linkToCharacter',
    handler: async (payload: unknown) => {
      const params = payload as {
        characterId: string;
        imageId: string;
        isPrimary: boolean;
      };
      const result = await imageGraphRepository.linkImageToCharacter(params);

      return { data: result[0] };
    },
  },
  {
    type: 'image:graph:updateLink',
    handler: async (payload: unknown) => {
      const params = payload as {
        characterId: string;
        imageId: string;
        isPrimary: boolean;
      };
      const result = await imageGraphRepository.updateImageLink(params);

      return { data: result[0] };
    },
  },
  {
    type: 'image:graph:unlinkFromCharacter',
    handler: async (payload: unknown) => {
      const params = payload as {
        characterId: string;
        imageId: string;
      };
      await imageGraphRepository.unlinkImageFromCharacter(params);

      return { success: true };
    },
  },
  {
    type: 'image:graph:deleteNode',
    handler: async (payload: unknown) => {
      const { imageId } = payload as { imageId: string };
      await imageGraphRepository.deleteImageNode(imageId);

      return { success: true };
    },
  },
  {
    type: 'image:graph:getImagesByCharacterId',
    handler: async (payload: unknown) => {
      const { characterId } = payload as { characterId: string };
      const result = await imageGraphRepository.findImagesByCharacterId(characterId);

      return { data: result };
    },
  },
  {
    type: 'image:graph:getPrimaryImageByCharacterId',
    handler: async (payload: unknown) => {
      const { characterId } = payload as { characterId: string };
      const result =
        await imageGraphRepository.findPrimaryImageByCharacterId(characterId);

      return { data: result[0] || null };
    },
  },
  {
    type: 'image:graph:getCharactersByImageId',
    handler: async (payload: unknown) => {
      const { imageId } = payload as { imageId: string };
      const result = await imageGraphRepository.findCharactersByImageId(imageId);

      return { data: result };
    },
  },
  {
    type: 'image:graph:getNodeById',
    handler: async (payload: unknown) => {
      const { imageId } = payload as { imageId: string };
      const result = await imageGraphRepository.findImageNodeById(imageId);

      return { data: result[0] || null };
    },
  },
  {
    type: 'image:graph:getAllNodes',
    handler: async () => {
      const result = await imageGraphRepository.findAllImageNodes();

      return { data: result };
    },
  },
] as const;

type ImageGraphHandler = (typeof imageGraphHandlers)[number];

export type ImageGraphHandlerMap = {
  [H in ImageGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
