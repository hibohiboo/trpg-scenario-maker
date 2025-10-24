import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { createScenarioAction } from '../actions/create';
import {
  scenarioSlice,
  openCreateModal,
  closeCreateModal,
  setCreateTitle,
} from '../model/scenarioSlice';

export const useCreateScenario = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state[scenarioSlice.reducerPath].isCreateModalOpen);
  const title = useAppSelector((state) => state[scenarioSlice.reducerPath].createTitle);
  const isSubmitting = useAppSelector((state) => state[scenarioSlice.reducerPath].isSubmitting);

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
