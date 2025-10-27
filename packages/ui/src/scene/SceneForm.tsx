import { Button } from '../common';
import { SceneBasicFields } from './form/SceneBasicFields';
import { SceneConnectionsSection } from './form/SceneConnectionsSection';
import { SceneEventsSection } from './form/SceneEventsSection';
import { useSceneForm, type SceneFormProps } from './form/useSceneForm';

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';
const labelClassName = 'block text-sm font-medium text-gray-700';

const getHasEventHandlers = (formState: ReturnType<typeof useSceneForm>) =>
  formState.onEventAdd &&
  formState.onEventUpdate &&
  formState.onEventDelete &&
  formState.onEventMoveUp &&
  formState.onEventMoveDown;

export function SceneForm(props: SceneFormProps) {
  const formState = useSceneForm(props);
  const {
    title,
    setTitle,
    description,
    setDescription,
    isMasterScene,
    setIsMasterScene,
    handleSubmit,
    submitLabel,
    onCancel,
  } = formState;

  const hasEventHandlers = getHasEventHandlers(formState);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      {formState.scene && formState.events && hasEventHandlers && (
        <SceneEventsSection
          events={formState.events}
          onAddEvent={formState.onEventAdd!}
          onUpdateEvent={formState.onEventUpdate!}
          onDeleteEvent={formState.onEventDelete!}
          onMoveEventUp={formState.onEventMoveUp!}
          onMoveEventDown={formState.onEventMoveDown!}
        />
      )}
      {formState.scene && (
        <SceneConnectionsSection
          nextScenes={formState.nextScenes}
          previousScenes={formState.previousScenes}
          availableNextScenes={formState.availableNextScenes}
          availablePreviousScenes={formState.availablePreviousScenes}
          onConnectionDelete={formState.onConnectionDelete}
          onAddNextScene={formState.handleAddNextScene}
          onAddPreviousScene={formState.handleAddPreviousScene}
          inputClassName={inputClassName}
        />
      )}
    </form>
  );
}
