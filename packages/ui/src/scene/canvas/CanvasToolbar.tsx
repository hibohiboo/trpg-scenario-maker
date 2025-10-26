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
          <li>• 接続線を選択して Backspace キーで削除</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-gray-700">自動整列：</p>
        <button
          onClick={() => onLayout('TB')}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          type="button"
        >
          縦方向
        </button>
        <button
          onClick={() => onLayout('LR')}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          type="button"
        >
          横方向
        </button>
      </div>
    </div>
  );
}
