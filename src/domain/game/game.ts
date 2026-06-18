export { CPU_PLAYER, HUMAN_PLAYER } from '@/domain/game/constants';
export {
  consumeCapturedPiece,
  createInitialGameState,
  isTerminalPhase,
  retryGame,
  startGame,
} from '@/domain/game/stateHelpers';
export { applyMoveWithCapture, executeMove } from '@/domain/game/turn';
export { selectBoardSquare, selectCapturedPiece } from '@/domain/game/selection';
export { selectDifficulty } from '@/domain/game/menu';
export { defaultMovePicker, pickCpuMove } from '@/domain/game/cpu';
export type { MovePicker } from '@/domain/game/cpu';
