import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { readRelationshipsByCharacterIdAction } from '../actions/relationshipActions';
import {
  outgoingRelationshipsSelector,
  incomingRelationshipsSelector,
  relationshipSlice,
} from '../model/relationshipSlice';

/**
 * 特定のキャラクターの関係性を取得するHook
 * @param characterId - キャラクターID
 */
export const useCharacterRelationships = (characterId: string | null) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (characterId) {
      dispatch(readRelationshipsByCharacterIdAction(characterId));
    }
  }, [dispatch, characterId]);

  const outgoingRelationships = useAppSelector(outgoingRelationshipsSelector);
  const incomingRelationships = useAppSelector(incomingRelationshipsSelector);
  const isLoading = useAppSelector(
    (state) => state[relationshipSlice.reducerPath].isLoading,
  );

  return {
    outgoingRelationships,
    incomingRelationships,
    isLoading,
  };
};
