import { useAppSelector } from '@/shared/lib/store';
import { sceneSlice } from '../model/sceneSlice';

/**
 * シーン一覧を取得するカスタムフック
 */
export const useSceneList = () => {
  const scenes = useAppSelector(
    (state) => state[sceneSlice.reducerPath].scenes,
  );
  const connections = useAppSelector(
    (state) => state[sceneSlice.reducerPath].connections,
  );
  const isLoading = useAppSelector(
    (state) => state[sceneSlice.reducerPath].isLoading,
  );
  const error = useAppSelector((state) => state[sceneSlice.reducerPath].error);

  return {
    scenes,
    connections,
    isLoading,
    error,
  };
};
