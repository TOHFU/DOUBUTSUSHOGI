'use client';

import { useCallback, type Dispatch } from 'react';

import { isHumanTurn } from '@/hooks/game/useGamePhase';

import type { GameAction } from '@/hooks/game/types';
import type { Difficulty, GameState, PieceKind, Position } from '@/domain/game/types';

/**
 * 人間プレイヤー向けのゲーム操作コールバックを生成するフック。
 * @param state - 現在のゲーム状態
 * @param dispatch - ゲームアクションの dispatch 関数
 * @returns ゲーム操作コールバック群
 */
export function useGameActions(
  state: GameState,
  dispatch: Dispatch<GameAction>,
) {
  const selectDifficulty = useCallback(
    (difficulty: Difficulty) => {
      dispatch({ type: 'selectDifficulty', difficulty });
    },
    [dispatch],
  );

  const start = useCallback(() => {
    dispatch({ type: 'start' });
  }, [dispatch]);

  const retry = useCallback(() => {
    dispatch({ type: 'retry' });
  }, [dispatch]);

  const selectSquare = useCallback(
    (position: Position) => {
      if (!isHumanTurn(state)) {
        return;
      }

      dispatch({ type: 'selectSquare', position });
    },
    [dispatch, state],
  );

  const selectCaptured = useCallback(
    (piece: PieceKind) => {
      if (!isHumanTurn(state)) {
        return;
      }

      dispatch({ type: 'selectCaptured', piece });
    },
    [dispatch, state],
  );

  return {
    selectDifficulty,
    start,
    retry,
    selectSquare,
    selectCaptured,
  };
}
