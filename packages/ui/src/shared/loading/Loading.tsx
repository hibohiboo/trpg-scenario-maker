import type { ReactNode } from 'react';

interface LoadingProps {
  /**
   * 読込中メッセージ（デフォルト: "読み込み中..."）
   */
  message?: string;
  /**
   * サイズ（デフォルト: "md"）
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * カスタムクラス名
   */
  className?: string;
  /**
   * 全画面表示（中央配置）
   */
  fullScreen?: boolean;
}

const sizeStyles = {
  sm: {
    spinner: 'h-4 w-4 border-2',
    text: 'text-sm',
  },
  md: {
    spinner: 'h-8 w-8 border-3',
    text: 'text-base',
  },
  lg: {
    spinner: 'h-12 w-12 border-4',
    text: 'text-lg',
  },
};

export function Loading({
  message = '読み込み中...',
  size = 'md',
  className = '',
  fullScreen = false,
}: LoadingProps) {
  const content: ReactNode = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeStyles[size].spinner} animate-spin rounded-full border-indigo-600 border-t-transparent`}
        role="status"
        aria-label="読み込み中"
      />
      <span className={`text-gray-600 ${sizeStyles[size].text}`}>
        {message}
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="p-8">{content}</div>;
}
