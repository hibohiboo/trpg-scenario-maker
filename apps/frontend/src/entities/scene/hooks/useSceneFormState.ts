import type { Scene } from '@trpg-scenario-maker/ui';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import {
  openSceneForm,
  closeSceneForm,
  setEditingScene,
  sceneSlice,
} from '../model/sceneSlice';

/**
 * シーンフォームの状態を管理するカスタムフック
 */
export const useSceneFormState = () => {
  const dispatch = useAppDispatch();

  const isFormOpen = useAppSelector(
    (state) => state[sceneSlice.reducerPath].isFormOpen,
  );
  const editingScene = useAppSelector(
    (state) => state[sceneSlice.reducerPath].editingScene,
  );

  const handleOpenForm = () => {
    dispatch(openSceneForm());
  };

  const handleCloseForm = () => {
    dispatch(closeSceneForm());
  };

  const handleEditScene = (scene: Scene) => {
    dispatch(setEditingScene(scene));
  };

  return {
    isFormOpen,
    editingScene,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,
  };
};
