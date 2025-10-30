import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { readAllRelationshipsAction } from '../actions/relationshipActions';
import {
  relationshipsSelector,
  relationshipSlice,
} from '../model/relationshipSlice';

/**
 * 全関係性を取得するHook
 */
export const useAllRelationships = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(readAllRelationshipsAction());
  }, [dispatch]);

  const relationships = useAppSelector(relationshipsSelector);
  const isLoading = useAppSelector(
    (state) => state[relationshipSlice.reducerPath].isLoading,
  );

  return {
    relationships,
    isLoading,
  };
};
