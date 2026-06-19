'use client';

import { useEffect, type Dispatch } from 'react';

import { HUMAN_PLAYER } from '@/domain/game/constants';
import { isTerminalPhase } from '@/domain/game/stateHelpers';

import type { GameAction } from '@/hooks/game/types';
import type { GameState } from '@/domain/game/types';

const CPU_MOVE_DELAY_MS = 500;

/**
 * CPU 手番時に自動で手を指すフック。
 * @param state - 現在のゲーム状態
 * @param dispatch - ゲームアクションの dispatch 関数
 */
export function useCpuTurn(
  state: GameState,
  dispatch: Dispatch<GameAction>,
): void {
  useEffect(() => {
    if (
      state.currentPlayer !== HUMAN_PLAYER &&
      !isTerminalPhase(state.phase)
    ) {
      const timer = setTimeout(() => {
        dispatch({ type: 'cpuMove' });
      }, CPU_MOVE_DELAY_MS);

      return () => {
        clearTimeout(timer);
      };
    }

    return undefined;
  }, [state.currentPlayer, state.phase, state.board, state.captured, dispatch]);
}
