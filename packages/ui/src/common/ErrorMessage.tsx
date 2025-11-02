import type { ReactNode } from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
  /**
   * エラーメッセージ（文字列またはErrorオブジェクト）
   */
  error?: string | Error;
  /**
   * タイトル（デフォルト: "エラー"）
   */
  title?: string;
  /**
   * カスタムクラス名
   */
  className?: string;
  /**
   * 全画面表示（中央配置）
   */
  fullScreen?: boolean;
  /**
   * リトライボタンのコールバック
   */
  onRetry?: () => void;
  /**
   * リトライボタンのラベル
   */
  retryLabel?: string;
}
const getErrorMessage = (error: string | Error | undefined) =>
  typeof error === 'string'
    ? error
    : error?.message || '不明なエラーが発生しました';

export function ErrorMessage({
  error,
  title = 'エラー',
  className = '',
  fullScreen = false,
  onRetry,
  retryLabel = '再試行',
}: ErrorMessageProps) {
  const errorMessage = getErrorMessage(error);

  const content: ReactNode = (
    <div
      className={`rounded-lg border border-red-200 bg-red-50 p-6 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800">{title}</h3>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="danger"
              size="sm"
              className="mt-4"
            >
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">{content}</div>
      </div>
    );
  }

  return <div className="p-8">{content}</div>;
}
