import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { createScenarioAction } from '../actions/create';
import {
  isCreateModalOpenSelector,
  createTitleSelector,
  isSubmittingSelector,
  openCreateModal,
  closeCreateModal,
  setCreateTitle,
} from '../model/scenarioSlice';

export const useCreateScenario = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(isCreateModalOpenSelector);
  const title = useAppSelector(createTitleSelector);
  const isSubmitting = useAppSelector(isSubmittingSelector);

  const open = () => {
    dispatch(openCreateModal());
  };

  const close = () => {
    dispatch(closeCreateModal());
  };

  const setTitle = (newTitle: string) => {
    dispatch(setCreateTitle(newTitle));
  };

  const submit = async () => {
    await dispatch(createScenarioAction({ title }));
  };

  return {
    isOpen,
    title,
    isSubmitting,
    open,
    close,
    setTitle,
    submit,
  };
};
