import { createInitialGameState } from '@/domain/game/stateHelpers';
import type { Difficulty, GameState } from '@/domain/game/types';

/**
 * 難易度を選択し、ゲーム開始確認フェーズへ遷移する。
 * @param state - 選択前のゲーム状態
 * @param difficulty - 選択された難易度
 * @returns ゲーム開始確認フェーズのゲーム状態
 */
export function selectDifficulty(
  state: GameState,
  difficulty: Difficulty,
): GameState {
  return {
    ...createInitialGameState(),
    difficulty,
    phase: 'gameStart',
    captured: state.captured,
  };
}
