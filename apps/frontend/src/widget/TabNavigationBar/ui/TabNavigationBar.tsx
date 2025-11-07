import type { TabItem } from '../types';

export interface TabNavigationBarProps {
  items: TabItem[];
  currentTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * タブナビゲーションバー
 *
 * 複数のタブを表示し、タブの切り替えを管理する制御コンポーネント
 */
export function TabNavigationBar({
  items,
  currentTab,
  onTabChange,
}: TabNavigationBarProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <ul className="flex space-x-4">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`inline-flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
