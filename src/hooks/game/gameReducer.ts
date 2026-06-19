import {
  createInitialGameState,
  pickCpuMove,
  retryGame,
  selectBoardSquare,
  selectCapturedPiece,
  selectDifficulty,
  startGame,
} from '@/domain/game/game';

import type { GameAction } from '@/hooks/game/types';
import type { GameState } from '@/domain/game/types';

/**
 * ゲーム状態をドメイン関数で遷移させる reducer。
 * @param state - 現在のゲーム状態
 * @param action - 実行するアクション
 * @returns 遷移後のゲーム状態
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'selectDifficulty':
      return selectDifficulty(state, action.difficulty);
    case 'start':
      return startGame(state);
    case 'retry':
      return retryGame();
    case 'selectSquare':
      return selectBoardSquare(state, action.position);
    case 'selectCaptured':
      return selectCapturedPiece(state, action.piece);
    case 'cpuMove':
      return pickCpuMove(state);
    default:
      return state;
  }
}

export { createInitialGameState };
