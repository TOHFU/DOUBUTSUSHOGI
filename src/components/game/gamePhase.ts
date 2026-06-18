import { HUMAN_PLAYER } from '@/domain/game/constants';
import { isTerminalPhase } from '@/domain/game/stateHelpers';
import type { GameState } from '@/domain/game/types';

export function isHumanTurn(state: GameState): boolean {
  return state.currentPlayer === HUMAN_PLAYER;
}

export function isHumanCapturingActive(state: GameState): boolean {
  return isHumanTurn(state) && !isTerminalPhase(state.phase);
}

export function isResultPhase(phase: GameState['phase']): boolean {
  return phase === 'youWin' || phase === 'youLose';
}

export function isOverlayPhase(phase: GameState['phase']): boolean {
  return (
    phase === 'menu' ||
    phase === 'gameStart' ||
    phase === 'youWin' ||
    phase === 'youLose'
  );
}
