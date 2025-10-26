import { Button } from '../common';
import { SceneBasicFields } from './form/SceneBasicFields';
import { SceneConnectionsSection } from './form/SceneConnectionsSection';
import { useSceneForm, type SceneFormProps } from './form/useSceneForm';

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';
const labelClassName = 'block text-sm font-medium text-gray-700';

export function SceneForm(props: SceneFormProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    isMasterScene,
    setIsMasterScene,
    nextScenes,
    previousScenes,
    availableNextScenes,
    availablePreviousScenes,
    handleAddNextScene,
    handleAddPreviousScene,
    handleSubmit,
    submitLabel,
    scene,
    onConnectionDelete,
    onCancel,
  } = useSceneForm(props);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SceneBasicFields
        title={title}
        description={description}
        isMasterScene={isMasterScene}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onMasterSceneChange={setIsMasterScene}
        inputClassName={inputClassName}
        labelClassName={labelClassName}
      />

      {scene && (
        <SceneConnectionsSection
          nextScenes={nextScenes}
          previousScenes={previousScenes}
          availableNextScenes={availableNextScenes}
          availablePreviousScenes={availablePreviousScenes}
          onConnectionDelete={onConnectionDelete}
          onAddNextScene={handleAddNextScene}
          onAddPreviousScene={handleAddPreviousScene}
          inputClassName={inputClassName}
        />
      )}

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
