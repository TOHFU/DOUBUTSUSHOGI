import type { PieceKind, Player } from '@/domain/game/types';

const UI_ASSETS = {
  stage: '/assets/game/ui/stage.png',
  backgroundBlue: '/assets/game/ui/background-blue.png',
  backgroundGreen: '/assets/game/ui/background-green.png',
  teamBlue: '/assets/game/ui/team-blue.png',
  teamGreen: '/assets/game/ui/team-green.png',
  select: '/assets/game/ui/select.png',
  gameStartOverlay: '/assets/game/ui/game-start-overlay.png',
  youWinMessage: '/assets/game/ui/you-win-message.png',
  youLoseMessage: '/assets/game/ui/you-lose-message.png',
  retryButton: '/assets/game/ui/retry-button.png',
  menuHeader: '/assets/game/ui/menu-header.png',
  menuDifficultyLabel: '/assets/game/ui/menu-difficulty-label.png',
  menuEasyButton: '/assets/game/ui/menu-easy-button.png',
  menuHardButton: '/assets/game/ui/menu-hard-button.png',
} as const;

export function getPieceImagePath(kind: PieceKind, owner: Player): string {
  return `/assets/game/pieces/${owner}/${kind}.png`;
}

export function getTransparentPieceImagePath(kind: PieceKind): string {
  const fileName = kind === 'chicken' ? 'chick' : kind;
  return `/assets/game/pieces/transparent/${fileName}.png`;
}

export { UI_ASSETS };
