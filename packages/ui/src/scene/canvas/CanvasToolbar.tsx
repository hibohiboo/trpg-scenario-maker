import { Button } from '../../shared/button';

interface CanvasToolbarProps {
  onLayout: (direction: 'TB' | 'LR') => void;
}

export function CanvasToolbar({ onLayout }: CanvasToolbarProps) {
  return (
    <div className="absolute left-4 top-4 z-10 flex gap-4">
      <div className="rounded-lg bg-white p-3 text-sm shadow-md">
        <p className="font-semibold text-gray-700">操作方法：</p>
        <ul className="mt-1 space-y-1 text-gray-600">
          <li>• ノードをドラッグして移動</li>
          <li>• ノードの端からドラッグして接続</li>
        </ul>
        <details>
          <summary>凡例</summary>
          <ul className="mt-1 space-y-1 text-gray-600">
            <li>• 青色（アニメーション付き）: シーン間の接続</li>
            <li>• オレンジ色: 情報項目同士の接続</li>
            <li>
              • 緑色（破線）: 情報項目→シーンへの接続（情報が指し示すシーン）
            </li>
            <li>
              • 紫色（破線）: シーン→情報項目への接続（シーンで獲得できる情報）
            </li>
          </ul>
        </details>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-gray-700">自動整列：</p>
        <Button
          onClick={() => onLayout('TB')}
          variant="primary"
          size="sm"
          type="button"
        >
          縦方向
        </Button>
        <Button
          onClick={() => onLayout('LR')}
          variant="primary"
          size="sm"
          type="button"
        >
          横方向
        </Button>
      </div>
    </div>
  );
}
