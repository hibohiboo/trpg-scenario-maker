import { Link } from 'react-router';

export interface NavigationItem {
  /** リンクパス */
  path: string;
  /** 表示ラベル */
  label: string;
}

export interface NavigationProps {
  /** ナビゲーション項目のリスト */
  items: NavigationItem[];
  /** 現在のパス（アクティブ状態の判定に使用） */
  currentPath?: string;
}

/**
 * ナビゲーションメニューコンポーネント
 */
export function Navigation({ items, currentPath = '' }: NavigationProps) {
  return (
    <nav className="mb-6 border-b border-gray-200">
      <ul className="flex space-x-4">
        {items.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`inline-block px-4 py-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
