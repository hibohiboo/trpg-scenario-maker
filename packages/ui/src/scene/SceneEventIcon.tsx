import {
  FaBed,
  FaCodeBranch,
  FaComments,
  FaCrosshairs,
  FaFlagCheckered,
  FaGem,
  FaPlay,
  FaPuzzlePiece,
  FaQuestion,
  FaSkullCrossbones,
} from 'react-icons/fa';
import type { SceneEventType } from './types';

export interface SceneEventIconProps {
  type: SceneEventType;
  className?: string;
  size?: number;
  title?: string;
}

const iconMap = {
  start: FaPlay,
  conversation: FaComments,
  choice: FaCodeBranch,
  battle: FaCrosshairs,
  treasure: FaGem,
  trap: FaSkullCrossbones,
  puzzle: FaPuzzlePiece,
  rest: FaBed,
  ending: FaFlagCheckered,
} as const;

/**
 * シーンイベントタイプに応じたアイコンを表示するコンポーネント
 */
export function SceneEventIcon({
  type,
  className = '',
  size = 16,
  title,
}: SceneEventIconProps) {
  const Icon = iconMap[type] || FaQuestion;

  return <Icon size={size} className={className} title={title || type} />;
}
