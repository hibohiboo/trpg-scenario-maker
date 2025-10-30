import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { readCharacterListAction } from '../actions/characterActions';
import { charactersSelector, characterSlice } from '../model/characterSlice';

export const useCharacterList = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(readCharacterListAction());
  }, [dispatch]);

  const characters = useAppSelector(charactersSelector);
  const isLoading = useAppSelector(
    (state) => state[characterSlice.reducerPath].isLoading,
  );

  return {
    characters,
    isLoading,
  };
};
