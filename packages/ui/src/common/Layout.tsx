import type { ReactNode } from 'react';

interface LayoutProps {
  /**
   * レイアウト内に表示するコンテンツ
   */
  children: ReactNode;
  /**
   * カスタムクラス名（container要素に適用）
   */
  className?: string;
  /**
   * 最大幅（デフォルト: "container"）
   * - "container": Tailwindのcontainerクラス
   * - "full": 最大幅なし
   * - "lg", "xl", "2xl", etc.: Tailwindの最大幅クラス
   */
  maxWidth?: 'container' | 'full' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  /**
   * 横パディング（デフォルト: "px-4"）
   */
  paddingX?: string;
  /**
   * 縦パディング（デフォルト: "py-8"）
   */
  paddingY?: string;
}

const maxWidthClasses: Record<
  NonNullable<LayoutProps['maxWidth']>,
  string
> = {
  container: 'container',
  full: 'w-full',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '3xl': 'max-w-7xl',
  '4xl': 'max-w-8xl',
};

/**
 * 共通レイアウトコンテナ
 * サイト全体で一貫したレイアウトを提供
 */
export function Layout({
  children,
  className = '',
  maxWidth = 'container',
  paddingX = 'px-4',
  paddingY = 'py-8',
}: LayoutProps) {
  const widthClass = maxWidthClasses[maxWidth];

  return (
    <div className={`${widthClass} mx-auto ${paddingX} ${paddingY} ${className}`}>
      {children}
    </div>
  );
}
