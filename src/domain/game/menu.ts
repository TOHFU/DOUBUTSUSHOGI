import { createInitialGameState } from '@/domain/game/stateHelpers';
import type { Difficulty, GameState } from '@/domain/game/types';

/** 難易度を選択し、ゲーム開始確認フェーズへ遷移する */
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
