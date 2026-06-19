import type { Difficulty, GameState, PieceKind, Position } from '@/domain/game/types';

/** useGameReducer が処理するアクションの型 */
export type GameAction =
  | { type: 'selectDifficulty'; difficulty: Difficulty }
  | { type: 'start' }
  | { type: 'retry' }
  | { type: 'selectSquare'; position: Position }
  | { type: 'selectCaptured'; piece: PieceKind }
  | { type: 'cpuMove' };

/** useGameController が返すゲーム操作 API */
export interface GameController {
  state: GameState;
  selectDifficulty: (difficulty: Difficulty) => void;
  start: () => void;
  retry: () => void;
  selectSquare: (position: Position) => void;
  selectCaptured: (piece: PieceKind) => void;
}
