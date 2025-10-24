import { scenarioToString } from '@trpg-scenario-maker/schema';
import type { Scenario } from '@trpg-scenario-maker/ui/scenario/types';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { createScenarioAction } from '../actions/create';
import { deleteScenarioAction } from '../actions/delete';
import { readScenarioAction } from '../actions/read';
import { updateScenarioAction } from '../actions/update';
import {
  scenariosSelector,
  isLoadingSelector,
  isCreateModalOpenSelector,
  isEditModalOpenSelector,
  isDeleteModalOpenSelector,
  createTitleSelector,
  editTitleSelector,
  editingScenarioSelector,
  deletingScenarioSelector,
  isSubmittingSelector,
  isDeletingSelector,
  openCreateModal,
  closeCreateModal,
  setCreateTitle,
  openEditModal,
  closeEditModal,
  setEditTitle,
  openDeleteModal,
  closeDeleteModal,
} from '../model/scenarioSlice';

export const usePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(readScenarioAction());
  }, []);

  const scenarios = useAppSelector(scenariosSelector);
  const isLoading = useAppSelector(isLoadingSelector);
  const isCreateModalOpen = useAppSelector(isCreateModalOpenSelector);
  const isEditModalOpen = useAppSelector(isEditModalOpenSelector);
  const isDeleteModalOpen = useAppSelector(isDeleteModalOpenSelector);
  const createTitle = useAppSelector(createTitleSelector);
  const editTitle = useAppSelector(editTitleSelector);
  const editingScenario = useAppSelector(editingScenarioSelector);
  const deletingScenario = useAppSelector(deletingScenarioSelector);
  const isSubmitting = useAppSelector(isSubmittingSelector);
  const isDeleting = useAppSelector(isDeletingSelector);

  const handleCreateNew = () => {
    dispatch(openCreateModal());
  };

  const handleCloseCreateModal = () => {
    dispatch(closeCreateModal());
  };

  const handleCreateTitleChange = (title: string) => {
    dispatch(setCreateTitle(title));
  };

  const handleCreateSubmit = async () => {
    dispatch(createScenarioAction({ title: createTitle }));
  };

  const handleEdit = (scenario: Scenario) => {
    dispatch(openEditModal(scenarioToString(scenario)));
  };

  const handleCloseEditModal = () => {
    dispatch(closeEditModal());
  };

  const handleEditTitleChange = (title: string) => {
    dispatch(setEditTitle(title));
  };

  const handleEditSubmit = async () => {
    if (!editingScenario?.id) return;
    dispatch(updateScenarioAction({ id: editingScenario.id, title: editTitle }));
  };

  const handleDelete = (scenario: Scenario) => {
    dispatch(openDeleteModal(scenarioToString(scenario)));
  };

  const handleCloseDeleteModal = () => {
    dispatch(closeDeleteModal());
  };

  const handleDeleteConfirm = () => {
    if (!deletingScenario?.id) return;
    dispatch(deleteScenarioAction({ id: deletingScenario.id }));
  };

  const handleClick = (scenario: Scenario) => {
    // TODO: 詳細画面への遷移実装
    console.log('Clicked scenario:', scenario.id);
  };

  return {
    scenarios,
    isLoading,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    createTitle,
    editTitle,
    editingScenario,
    deletingScenario,
    isSubmitting,
    isDeleting,
    onCreateNew: handleCreateNew,
    onCloseCreateModal: handleCloseCreateModal,
    onCreateTitleChange: handleCreateTitleChange,
    onCreateSubmit: handleCreateSubmit,
    onEdit: handleEdit,
    onCloseEditModal: handleCloseEditModal,
    onEditTitleChange: handleEditTitleChange,
    onEditSubmit: handleEditSubmit,
    onDelete: handleDelete,
    onCloseDeleteModal: handleCloseDeleteModal,
    onDeleteConfirm: handleDeleteConfirm,
    onClick: handleClick,
  };
};
