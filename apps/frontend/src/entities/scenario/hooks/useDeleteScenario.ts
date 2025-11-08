import { scenarioToString } from '@trpg-scenario-maker/schema';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { deleteScenarioAction } from '../actions/scenarioActions';
import {
  scenarioSlice,
  deletingScenarioSelector,
  openDeleteModal,
  closeDeleteModal,
} from '../model/scenarioSlice';
import type { Scenario } from '@trpg-scenario-maker/ui';

export const useDeleteScenario = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state[scenarioSlice.reducerPath].isDeleteModalOpen,
  );
  const deletingScenario = useAppSelector(deletingScenarioSelector);
  const isDeleting = useAppSelector(
    (state) => state[scenarioSlice.reducerPath].isDeleting,
  );

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
