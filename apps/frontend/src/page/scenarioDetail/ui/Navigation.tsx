export interface NavigationItem {
  path: string;
  label: string;
}

export interface NavigationProps {
  items: string[];
  current: string;
  onClick: (path: string) => void;
}
export function Navigation({
  items,
  current: currentPath,
  onClick,
}: NavigationProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <ul className="flex space-x-4">
        {items.map((item) => {
          const isActive = currentPath === item;
          return (
            <li
              key={item}
              className={`inline-block px-4 py-2 border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => onClick(item)}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
