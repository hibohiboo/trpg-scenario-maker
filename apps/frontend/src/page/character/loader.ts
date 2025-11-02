import { store } from '@/app/store';
import { readCharacterListAction } from '@/entities/character/actions/characterActions';
import { readAllRelationshipsAction } from '@/entities/character/actions/relationshipActions';

const { dispatch } = store;

export const characterRelationshipLoader = async () => {
  // キャラクター一覧と関係性一覧を並行で取得
  await Promise.all([
    dispatch(readCharacterListAction()),
    dispatch(readAllRelationshipsAction()),
  ]);

  return null;
};
