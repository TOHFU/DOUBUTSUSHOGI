import { createInitialGameState } from '@/domain/game/stateHelpers';
import type { Difficulty, GameState } from '@/domain/game/types';

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
