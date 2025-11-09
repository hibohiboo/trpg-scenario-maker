import type { CharacterWithRole } from './types';

export interface CharacterDetailPanelProps {
  character: CharacterWithRole;
  onClose?: () => void;
  children?: React.ReactNode;
}

/**
 * シナリオキャラクターの詳細パネル
 * 基本情報と追加コンテンツ（画像管理など）を表示
 */
export function CharacterDetailPanel({
  character,
  onClose,
  children,
}: CharacterDetailPanelProps) {
  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{character.name}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="閉じる"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-gray-600 mb-1">役割</h3>
          <p className="text-base">{character.role}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-600 mb-1">説明</h3>
          <p className="text-base">{character.description}</p>
        </div>
      </div>

      {children && <div className="border-t pt-4">{children}</div>}
    </div>
  );
}
