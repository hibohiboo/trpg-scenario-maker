import { scenarioToString } from '@trpg-scenario-maker/schema';
import type { Scenario } from '@trpg-scenario-maker/ui/scenario/types';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { updateScenarioAction } from '../actions/update';
import {
  isEditModalOpenSelector,
  editTitleSelector,
  editingScenarioSelector,
  isSubmittingSelector,
  openEditModal,
  closeEditModal,
  setEditTitle,
} from '../model/scenarioSlice';

export const useEditScenario = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(isEditModalOpenSelector);
  const title = useAppSelector(editTitleSelector);
  const editingScenario = useAppSelector(editingScenarioSelector);
  const isSubmitting = useAppSelector(isSubmittingSelector);

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
