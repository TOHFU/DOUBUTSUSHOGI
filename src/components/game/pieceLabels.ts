import type { PieceKind, Player } from '@/domain/game/types';

const PIECE_LABELS: Record<PieceKind, string> = {
  lion: 'ライオン',
  giraffe: 'キリン',
  elephant: 'ゾウ',
  chick: 'ひよこ',
  chicken: 'ニワトリ',
};

const PLAYER_LABELS: Record<Player, string> = {
  blue: 'あお',
  green: 'みどり',
};

export function getPieceLabel(kind: PieceKind): string {
  return PIECE_LABELS[kind];
}

export function getPlayerLabel(player: Player): string {
  return PLAYER_LABELS[player];
}

export function getPieceAccessibleName(kind: PieceKind, owner: Player): string {
  return `${getPlayerLabel(owner)} ${getPieceLabel(kind)}`;
}
