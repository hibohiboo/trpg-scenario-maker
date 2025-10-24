import { scenarioToString } from '@trpg-scenario-maker/schema';
import type { Scenario } from '@trpg-scenario-maker/ui/scenario/types';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { deleteScenarioAction } from '../actions/delete';
import {
  isDeleteModalOpenSelector,
  deletingScenarioSelector,
  isDeletingSelector,
  openDeleteModal,
  closeDeleteModal,
} from '../model/scenarioSlice';

export const useDeleteScenario = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(isDeleteModalOpenSelector);
  const deletingScenario = useAppSelector(deletingScenarioSelector);
  const isDeleting = useAppSelector(isDeletingSelector);

  const open = (scenario: Scenario) => {
    dispatch(openDeleteModal(scenarioToString(scenario)));
  };

  const close = () => {
    dispatch(closeDeleteModal());
  };

  const confirm = async () => {
    if (!deletingScenario?.id) return;
    await dispatch(deleteScenarioAction({ id: deletingScenario.id }));
  };

  return {
    isOpen,
    deletingScenario,
    isDeleting,
    open,
    close,
    confirm,
  };
};
