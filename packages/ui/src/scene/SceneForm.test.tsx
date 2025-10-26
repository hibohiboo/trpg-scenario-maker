import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SceneForm } from './SceneForm';
import type { Scene, SceneConnection } from './types';

describe('SceneForm - Connection filtering', () => {
  const scenes: Scene[] = [
    {
      id: '1',
      title: 'Scene 1',
      description: 'First scene',
      isMasterScene: true,
    },
    {
      id: '2',
      title: 'Scene 2',
      description: 'Second scene',
      isMasterScene: false,
    },
    {
      id: '3',
      title: 'Scene 3',
      description: 'Third scene',
      isMasterScene: false,
    },
    {
      id: '4',
      title: 'Scene 4',
      description: 'Fourth scene',
      isMasterScene: false,
    },
  ];

  it('should not allow selecting current scene as next scene', () => {
    const onSubmit = vi.fn();
    const onConnectionAdd = vi.fn();
    const connections: SceneConnection[] = [];

    render(
      <SceneForm
        scene={scenes[0]}
        scenes={scenes}
        connections={connections}
        onSubmit={onSubmit}
        onConnectionAdd={onConnectionAdd}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const nextSceneSelect = selects[1]; // Second select is for next scenes
    const options = Array.from(nextSceneSelect.querySelectorAll('option'));
    const sceneOptions = options.filter((opt) => opt.value !== '');

    // Current scene (Scene 1) should not be in options
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 1')).toBe(
      false,
    );
  });

  it('should not allow selecting current scene as previous scene', () => {
    const onSubmit = vi.fn();
    const onConnectionAdd = vi.fn();
    const connections: SceneConnection[] = [];

    render(
      <SceneForm
        scene={scenes[0]}
        scenes={scenes}
        connections={connections}
        onSubmit={onSubmit}
        onConnectionAdd={onConnectionAdd}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const prevSceneSelect = selects[0]; // First select is for previous scenes
    const options = Array.from(prevSceneSelect.querySelectorAll('option'));
    const sceneOptions = options.filter((opt) => opt.value !== '');

    // Current scene (Scene 1) should not be in options
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 1')).toBe(
      false,
    );
  });

  it('should not show already connected next scenes in dropdown', () => {
    const onSubmit = vi.fn();
    const onConnectionAdd = vi.fn();
    const connections: SceneConnection[] = [
      { id: '1-2', source: '1', target: '2' },
    ];

    render(
      <SceneForm
        scene={scenes[0]}
        scenes={scenes}
        connections={connections}
        onSubmit={onSubmit}
        onConnectionAdd={onConnectionAdd}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const nextSceneSelect = selects[1]; // Second select is for next scenes
    const options = Array.from(nextSceneSelect.querySelectorAll('option'));
    const sceneOptions = options.filter((opt) => opt.value !== '');

    // Scene 2 is already connected, should not be in options
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 2')).toBe(
      false,
    );
    // Scene 3 should be available
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 3')).toBe(
      true,
    );
  });

  it('should not show already connected previous scenes in dropdown', () => {
    const onSubmit = vi.fn();
    const onConnectionAdd = vi.fn();
    const connections: SceneConnection[] = [
      { id: '2-1', source: '2', target: '1' },
    ];

    render(
      <SceneForm
        scene={scenes[0]}
        scenes={scenes}
        connections={connections}
        onSubmit={onSubmit}
        onConnectionAdd={onConnectionAdd}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const prevSceneSelect = selects[0]; // First select is for previous scenes
    const options = Array.from(prevSceneSelect.querySelectorAll('option'));
    const sceneOptions = options.filter((opt) => opt.value !== '');

    // Scene 2 is already connected as previous, should not be in options
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 2')).toBe(
      false,
    );
    // Scene 3 should be available
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 3')).toBe(
      true,
    );
  });

  it('should prevent loop: next scene cannot be selected as previous scene', () => {
    const onSubmit = vi.fn();
    const onConnectionAdd = vi.fn();
    // Scene 1 -> Scene 2 (existing connection)
    const connections: SceneConnection[] = [
      { id: '1-2', source: '1', target: '2' },
    ];

    render(
      <SceneForm
        scene={scenes[0]} // Scene 1
        scenes={scenes}
        connections={connections}
        onSubmit={onSubmit}
        onConnectionAdd={onConnectionAdd}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const prevSceneSelect = selects[0]; // First select is for previous scenes
    const options = Array.from(prevSceneSelect.querySelectorAll('option'));
    const sceneOptions = options.filter((opt) => opt.value !== '');

    // Scene 2 is next scene, so it should NOT be available as previous scene
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 2')).toBe(
      false,
    );
  });

  it('should prevent loop: previous scene cannot be selected as next scene', () => {
    const onSubmit = vi.fn();
    const onConnectionAdd = vi.fn();
    // Scene 2 -> Scene 1 (existing connection)
    const connections: SceneConnection[] = [
      { id: '2-1', source: '2', target: '1' },
    ];

    render(
      <SceneForm
        scene={scenes[0]} // Scene 1
        scenes={scenes}
        connections={connections}
        onSubmit={onSubmit}
        onConnectionAdd={onConnectionAdd}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const nextSceneSelect = selects[1]; // Second select is for next scenes
    const options = Array.from(nextSceneSelect.querySelectorAll('option'));
    const sceneOptions = options.filter((opt) => opt.value !== '');

    // Scene 2 is previous scene, so it should NOT be available as next scene
    expect(sceneOptions.some((opt) => opt.textContent === 'Scene 2')).toBe(
      false,
    );
  });

  it('should allow adding connection when valid scene is selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onConnectionAdd = vi.fn();
    const connections: SceneConnection[] = [];

    render(
      <SceneForm
        scene={scenes[0]}
        scenes={scenes}
        connections={connections}
        onSubmit={onSubmit}
        onConnectionAdd={onConnectionAdd}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const nextSceneSelect = selects[1]; // Second select is for next scenes
    await user.selectOptions(nextSceneSelect, '2');

    const addButtons = screen.getAllByRole('button', { name: '追加' });
    const nextSceneAddButton = addButtons[1]; // Second add button is for next scenes
    await user.click(nextSceneAddButton);

    expect(onConnectionAdd).toHaveBeenCalledWith({
      source: '1',
      target: '2',
    });
  });
});
