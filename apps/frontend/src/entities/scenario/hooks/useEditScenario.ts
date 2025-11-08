import { scenarioToString } from '@trpg-scenario-maker/schema';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { updateScenarioAction } from '../actions/scenarioActions';
import {
  scenarioSlice,
  editingScenarioSelector,
  openEditModal,
  closeEditModal,
  setEditTitle,
} from '../model/scenarioSlice';
import type { Scenario } from '@trpg-scenario-maker/ui';

export const useEditScenario = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state[scenarioSlice.reducerPath].isEditModalOpen,
  );
  const title = useAppSelector(
    (state) => state[scenarioSlice.reducerPath].editTitle,
  );
  const editingScenario = useAppSelector(editingScenarioSelector);
  const isSubmitting = useAppSelector(
    (state) => state[scenarioSlice.reducerPath].isSubmitting,
  );

  const open = (scenario: Scenario) => {
    dispatch(openEditModal(scenarioToString(scenario)));
  };

  const close = () => {
    dispatch(closeEditModal());
  };

  const setTitle = (newTitle: string) => {
    dispatch(setEditTitle(newTitle));
  };

  const submit = async () => {
    if (!editingScenario?.id) return;
    await dispatch(updateScenarioAction({ id: editingScenario.id, title }));
  };

  return {
    isOpen,
    title,
    editingScenario,
    isSubmitting,
    open,
    close,
    setTitle,
    submit,
  };
};
