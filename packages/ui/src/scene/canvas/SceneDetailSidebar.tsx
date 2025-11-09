import { FiX } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../../shared/button';
import type { Scene } from '../types';

interface SceneDetailSidebarProps {
  scene: Scene | null;
  onClose: () => void;
}

export function SceneDetailSidebar({
  scene,
  onClose,
}: SceneDetailSidebarProps) {
  if (!scene) return null;

  return (
    <div className="absolute right-0 top-0 flex h-full w-96 flex-col border-l border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">{scene.title}</h2>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="p-1.5! text-gray-400 hover:text-gray-600"
          type="button"
          aria-label="閉じる"
        >
          <FiX size={20} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="markdown prose prose-sm max-w-none">
          <style>{`
            .markdown {
              h1 { font-size: 1.8rem; }
              h2 { font-size: 1.5rem; }
              table {
                border-collapse: collapse;
                td,th {
                  border: solid 1px #000;
                  padding: 0.1rem 0.5rem;
                }
              }
            }
          `}</style>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {scene.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
