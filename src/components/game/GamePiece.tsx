import { GameImage } from '@/components/game/GameImage';
import {
  getPieceImagePath,
  getTransparentPieceImagePath,
} from '@/components/game/assets';
import { getPieceAccessibleName } from '@/components/game/pieceLabels';
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
    <GameImage
      src={src}
      alt={getPieceAccessibleName(kind, owner)}
      width={size}
      height={size}
      className={`${owner === 'blue' ? 'rotate-180' : ''} object-contain ${className ?? ''}`}
      draggable={false}
    />
  );
}
