import type { CharacterGraphHandlerMap } from '@/entities/character/workers/characterGraphHandlers';
import type { CharacterRelationGraphHandlerMap } from '@/entities/character/workers/characterRelationGraphHandlers';
import type { InformationItemGraphHandlerMap } from '@/entities/informationItem/workers/informationItemGraphHandlers';
import type { ScenarioGraphHandlerMap } from '@/entities/scenario/workers/scenarioGraphHandlers';
import type { ScenarioCharacterGraphHandlerMap } from '@/entities/scenarioCharacter/workers/scenarioCharacterGraphHandlers';
import type { ScenarioCharacterRelationGraphHandlerMap } from '@/entities/scenarioCharacter/workers/scenarioCharacterRelationGraphHandlers';
import type { SceneGraphHandlerMap } from '@/entities/scene/workers/sceneGraphHandlers';
import type { SceneEventHandlerMap } from '@/entities/sceneEvent/workers/sceneEventHandlers';

/**
 * 全てのハンドラーマップを統合した型
 * graphdbWorkerClient.request メソッドで型推論を有効にするために使用
 */
export type GlobalHandlerMap = CharacterGraphHandlerMap &
  CharacterRelationGraphHandlerMap &
  InformationItemGraphHandlerMap &
  ScenarioGraphHandlerMap &
  ScenarioCharacterGraphHandlerMap &
  ScenarioCharacterRelationGraphHandlerMap &
  SceneGraphHandlerMap &
  SceneEventHandlerMap;
