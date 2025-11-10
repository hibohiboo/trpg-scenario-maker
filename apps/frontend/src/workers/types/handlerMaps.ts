import type { CharacterGraphHandlerMap } from '@/entities/character/workers/characterGraphHandlers';
import type { CharacterRelationGraphHandlerMap } from '@/entities/character/workers/characterRelationGraphHandlers';
import type { ImageGraphHandlerMap } from '@/entities/image/workers/imageGraphHandlers';
import type { ImageRdbHandlerMap } from '@/entities/image/workers/imageRdbHandlers';
import type { InformationItemGraphHandlerMap } from '@/entities/informationItem/workers/informationItemGraphHandlers';
import type { ScenarioExportHandlerMap } from '@/entities/scenario/workers/scenarioExportHandlers';
import type { ScenarioGraphHandlerMap } from '@/entities/scenario/workers/scenarioGraphHandlers';
import type { ScenarioRdbHandlerMap } from '@/entities/scenario/workers/scenarioHandlers';
import type { ScenarioRdbExportHandlerMap } from '@/entities/scenario/workers/scenarioRdbExportHandlers';
import type { ScenarioCharacterGraphHandlerMap } from '@/entities/scenarioCharacter/workers/scenarioCharacterGraphHandlers';
import type { ScenarioCharacterRelationGraphHandlerMap } from '@/entities/scenarioCharacter/workers/scenarioCharacterRelationGraphHandlers';
import type { SceneGraphHandlerMap } from '@/entities/scene/workers/sceneGraphHandlers';
import type { SceneEventHandlerMap } from '@/entities/sceneEvent/workers/sceneEventHandlers';

/**
 * 全てのGraphDBハンドラーマップを統合した型
 * graphdbWorkerClient.request メソッドで型推論を有効にするために使用
 */
export type GlobalHandlerMap = CharacterGraphHandlerMap &
  CharacterRelationGraphHandlerMap &
  ImageGraphHandlerMap &
  InformationItemGraphHandlerMap &
  ScenarioGraphHandlerMap &
  ScenarioExportHandlerMap &
  ScenarioCharacterGraphHandlerMap &
  ScenarioCharacterRelationGraphHandlerMap &
  SceneGraphHandlerMap &
  SceneEventHandlerMap;

/**
 * 全てのRDBハンドラーマップを統合した型
 * dbWorkerClient.request メソッドで型推論を有効にするために使用
 */
export type GlobalRdbHandlerMap = ImageRdbHandlerMap &
  ScenarioRdbHandlerMap &
  ScenarioRdbExportHandlerMap;
