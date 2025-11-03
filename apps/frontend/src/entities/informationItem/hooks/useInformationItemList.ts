import { useAppSelector } from '@/shared/lib/store';
import { informationItemSlice } from '../model/informationItemSlice';

/**
 * 情報項目一覧を取得するカスタムフック
 */
export const useInformationItemList = () => {
  const items = useAppSelector(
    (state) => state[informationItemSlice.reducerPath].items,
  );
  const informationConnections = useAppSelector(
    (state) => state[informationItemSlice.reducerPath].informationConnections,
  );
  const sceneInformationConnections = useAppSelector(
    (state) =>
      state[informationItemSlice.reducerPath].sceneInformationConnections,
  );
  const informationToSceneConnections = useAppSelector(
    (state) =>
      state[informationItemSlice.reducerPath].informationToSceneConnections,
  );
  const isLoading = useAppSelector(
    (state) => state[informationItemSlice.reducerPath].isLoading,
  );
  const error = useAppSelector(
    (state) => state[informationItemSlice.reducerPath].error,
  );

  return {
    items,
    informationConnections,
    sceneInformationConnections,
    informationToSceneConnections,
    isLoading,
    error,
  };
};
