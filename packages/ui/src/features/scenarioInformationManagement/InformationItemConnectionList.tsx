import { Button } from '../../shared/button';
import { Loading } from '../../shared/loading';
import type { InformationItem } from '../../informationItem/types';

export interface InformationItemConnectionDisplay {
  id: string;
  source: string;
  target: string;
  sourceName: string;
  targetName: string;
}

export interface InformationItemConnectionListProps {
  /** 情報項目のリスト */
  items: InformationItem[];
  /** 情報項目同士の関連リスト */
  connections: InformationItemConnectionDisplay[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** 関連追加ボタンクリック時のコールバック */
  onAddConnection?: () => void;
  /** 関連削除ボタンクリック時のコールバック */
  onRemoveConnection?: (connectionId: string) => void;
}

/**
 * 情報項目同士の関連一覧コンポーネント
 */
export function InformationItemConnectionList({
  items,
  connections,
  isLoading,
  onAddConnection,
  onRemoveConnection,
}: InformationItemConnectionListProps) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">情報項目の関連</h3>
        {onAddConnection && items.length >= 2 && (
          <Button onClick={onAddConnection} variant="primary" size="sm">
            関連を追加
          </Button>
        )}
      </div>

      {connections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {items.length < 2
            ? '関連を作成するには2つ以上の情報項目が必要です'
            : '登録されている関連がありません'}
        </div>
      ) : (
        <div className="space-y-2">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="information-item-connection-item flex items-center justify-between p-4 border border-gray-300 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{connection.sourceName}</span>
                <span className="text-gray-500">→</span>
                <span className="font-semibold">{connection.targetName}</span>
              </div>
              {onRemoveConnection && (
                <Button
                  onClick={() => onRemoveConnection(connection.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  削除
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
