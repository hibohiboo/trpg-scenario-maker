import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import {
  closeInformationItemForm,
  informationItemSlice,
  openInformationItemForm,
  setEditingItem,
} from '../model/informationItemSlice';
import type { InformationItem } from '@trpg-scenario-maker/ui';

/**
 * 情報項目フォームの状態を管理するカスタムフック
 */
export const useInformationItemFormState = () => {
  const dispatch = useAppDispatch();

  const isFormOpen = useAppSelector(
    (state) => state[informationItemSlice.reducerPath].isFormOpen,
  );
  const editingItem = useAppSelector(
    (state) => state[informationItemSlice.reducerPath].editingItem,
  );

  const handleOpenForm = () => {
    dispatch(openInformationItemForm());
  };

  const handleCloseForm = () => {
    dispatch(closeInformationItemForm());
  };

  const handleEditItem = (item: InformationItem) => {
    dispatch(setEditingItem(item));
  };

  return {
    isFormOpen,
    editingItem,
    handleOpenForm,
    handleCloseForm,
    handleEditItem,
  };
};
