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
  /** 現在のゲーム状態 */
  state: GameState;
  /** 難易度を選択する */
  selectDifficulty: (difficulty: Difficulty) => void;
  /** 対局を開始する */
  start: () => void;
  /** メニューへ戻して再挑戦する */
  retry: () => void;
  /** 盤面のマスを選択する */
  selectSquare: (position: Position) => void;
  /** 持ち駒を選択する */
  selectCaptured: (piece: PieceKind) => void;
}
