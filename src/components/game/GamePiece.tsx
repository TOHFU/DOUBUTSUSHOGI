import Image from 'next/image';

import {
  getPieceImagePath,
  getTransparentPieceImagePath,
} from '@/components/game/assets';
import type { PieceKind, Player } from '@/domain/game/types';

interface GamePieceProps {
  kind: PieceKind;
  owner: Player;
  size?: number;
  className?: string;
  variant?: 'board' | 'captured';
}

export function GamePiece({
  kind,
  owner,
  size = 100,
  className,
  variant = 'board',
}: GamePieceProps) {
  const src =
    variant === 'captured'
      ? getTransparentPieceImagePath(kind)
      : getPieceImagePath(kind, owner);

  return (
    <Image
      src={src}
      alt={`${owner} ${kind}`}
      width={size}
      height={size}
      unoptimized
      className={`${owner === 'blue' ? 'rotate-180' : ''} object-contain ${className ?? ''}`}
      draggable={false}
    />
  );
}
