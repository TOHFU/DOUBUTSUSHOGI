'use client';

import { useGameActions } from '@/hooks/game/useGameActions';
import { useCpuTurn } from '@/hooks/game/useCpuTurn';
import { useGameReducer } from '@/hooks/game/useGameReducer';

import type { GameController } from '@/hooks/game/types';

/**
 * ゲーム全体の状態管理と操作を提供するフック。
 * @returns ゲーム状態と操作 API
 */
export function useGameController(): GameController {
  const [state, dispatch] = useGameReducer();

  useCpuTurn(state, dispatch);

  const actions = useGameActions(state, dispatch);

  return {
    state,
    ...actions,
  };
}
