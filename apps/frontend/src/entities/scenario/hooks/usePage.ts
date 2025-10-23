import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
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
import type { Scenario } from '../model/scenarioSlice';

export const usePage = () => {
  const dispatch = useAppDispatch();

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

  const handleCreateSubmit = () => {
    // TODO: API呼び出し実装
    console.log('Creating scenario:', createTitle);
  };

  const handleEdit = (scenario: Scenario) => {
    dispatch(openEditModal(scenario));
  };

  const handleCloseEditModal = () => {
    dispatch(closeEditModal());
  };

  const handleEditTitleChange = (title: string) => {
    dispatch(setEditTitle(title));
  };

  const handleEditSubmit = () => {
    // TODO: API呼び出し実装
    console.log('Editing scenario:', editingScenario?.id, editTitle);
  };

  const handleDelete = (scenario: Scenario) => {
    dispatch(openDeleteModal(scenario));
  };

  const handleCloseDeleteModal = () => {
    dispatch(closeDeleteModal());
  };

  const handleDeleteConfirm = () => {
    // TODO: API呼び出し実装
    console.log('Deleting scenario:', deletingScenario?.id);
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
