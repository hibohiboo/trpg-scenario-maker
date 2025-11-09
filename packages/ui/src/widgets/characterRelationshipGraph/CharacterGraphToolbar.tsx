import { Button } from '../../shared/button';

interface CharacterGraphToolbarProps {
  onLayout: (layoutName: string) => void;
}

export function CharacterGraphToolbar({
  onLayout,
}: CharacterGraphToolbarProps) {
  return (
    <div className="absolute left-4 top-4 z-10 flex gap-4">
      <div className="rounded-lg bg-white p-3 text-sm shadow-md">
        <p className="font-semibold text-gray-700">操作方法：</p>
        <ul className="mt-1 space-y-1 text-gray-600">
          <li>• マウスホイールでズーム</li>
          <li>• ドラッグで画面移動</li>
          <li>• エッジをクリックで選択</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-gray-700">レイアウト：</p>
        <Button
          onClick={() => onLayout('cose')}
          variant="primary"
          size="sm"
          type="button"
        >
          自動配置
        </Button>
        <Button
          onClick={() => onLayout('breadthfirst')}
          variant="primary"
          size="sm"
          type="button"
        >
          階層表示
        </Button>
        <Button
          onClick={() => onLayout('circle')}
          variant="primary"
          size="sm"
          type="button"
        >
          円形配置
        </Button>
      </div>
    </div>
  );
}
