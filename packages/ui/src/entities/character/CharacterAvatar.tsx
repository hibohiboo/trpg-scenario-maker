import { FaUser } from 'react-icons/fa';

export interface CharacterAvatarProps {
  /** 画像のData URL */
  imageUrl?: string | null;
  /** キャラクター名（画像がない場合の代替テキスト） */
  name: string;
  /** アバターのサイズ（px） */
  size?: number;
  /** クラス名 */
  className?: string;
}

/**
 * キャラクターアバターコンポーネント
 * 画像がある場合は画像を、ない場合はプレースホルダを表示
 */
export function CharacterAvatar({
  imageUrl,
  name,
  size = 40,
  className = '',
}: CharacterAvatarProps) {
  const containerStyles = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
  };

  return (
    <div
      className={`rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}
      style={containerStyles}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <FaUser
          className="text-gray-500"
          size={size * 0.5}
        />
      )}
    </div>
  );
}
