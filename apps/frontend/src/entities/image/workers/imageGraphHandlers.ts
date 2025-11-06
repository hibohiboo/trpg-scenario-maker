import { imageGraphRepository } from '@trpg-scenario-maker/graphdb';
import {
  parseCreateImageNodePayload,
  parseImageLinkPayload,
  parseUnlinkImagePayload,
  parseImageIdPayload,
  parseCharacterIdForImagePayload,
  parseImageNodeList,
  parseCharacterImageLinkList,
  parseImageCharacterInfoList,
  parseCharacterImageInfoList,
} from '@trpg-scenario-maker/schema';

/**
 * 画像のグラフDB操作ハンドラー
 */
export const imageGraphHandlers = [
  {
    type: 'image:graph:createNode',
    handler: async (payload: unknown) => {
      const { imageId } = parseCreateImageNodePayload(payload);
      const result = await imageGraphRepository.createImageNode(imageId);
      const [data] = parseImageNodeList(result);

      if (!data) {
        throw new Error(
          'Failed to create image node: No result returned from database',
        );
      }

      return { data };
    },
  },
  {
    type: 'image:graph:linkToCharacter',
    handler: async (payload: unknown) => {
      const params = parseImageLinkPayload(payload);
      const result = await imageGraphRepository.linkImageToCharacter(params);
      const [data] = parseCharacterImageLinkList(result);

      if (!data) {
        throw new Error(
          'Failed to link image to character: No result returned from database',
        );
      }

      return { data };
    },
  },
  {
    type: 'image:graph:updateLink',
    handler: async (payload: unknown) => {
      const params = parseImageLinkPayload(payload);
      const result = await imageGraphRepository.updateImageLink(params);
      const [data] = parseCharacterImageLinkList(result);

      if (!data) {
        throw new Error(
          'Failed to update image link: No result returned from database',
        );
      }

      return { data };
    },
  },
  {
    type: 'image:graph:unlinkFromCharacter',
    handler: async (payload: unknown) => {
      const params = parseUnlinkImagePayload(payload);
      await imageGraphRepository.unlinkImageFromCharacter(params);

      return { success: true };
    },
  },
  {
    type: 'image:graph:deleteNode',
    handler: async (payload: unknown) => {
      const { imageId } = parseImageIdPayload(payload);
      await imageGraphRepository.deleteImageNode(imageId);

      return { success: true };
    },
  },
  {
    type: 'image:graph:getImagesByCharacterId',
    handler: async (payload: unknown) => {
      const { characterId } = parseCharacterIdForImagePayload(payload);
      const result =
        await imageGraphRepository.findImagesByCharacterId(characterId);
      const data = parseCharacterImageInfoList(result);

      return { data };
    },
  },
  {
    type: 'image:graph:getPrimaryImageByCharacterId',
    handler: async (payload: unknown) => {
      const { characterId } = parseCharacterIdForImagePayload(payload);
      const result =
        await imageGraphRepository.findPrimaryImageByCharacterId(characterId);
      const parsedList = parseCharacterImageInfoList(result);

      return { data: parsedList[0] || null };
    },
  },
  {
    type: 'image:graph:getCharactersByImageId',
    handler: async (payload: unknown) => {
      const { imageId } = parseImageIdPayload(payload);
      const result =
        await imageGraphRepository.findCharactersByImageId(imageId);
      const data = parseImageCharacterInfoList(result);

      return { data };
    },
  },
  {
    type: 'image:graph:getNodeById',
    handler: async (payload: unknown) => {
      const { imageId } = parseImageIdPayload(payload);
      const result = await imageGraphRepository.findImageNodeById(imageId);
      const parsedList = parseImageNodeList(result);

      return { data: parsedList[0] || null };
    },
  },
  {
    type: 'image:graph:getAllNodes',
    handler: async () => {
      const result = await imageGraphRepository.findAllImageNodes();
      const data = parseImageNodeList(result);

      return { data };
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
