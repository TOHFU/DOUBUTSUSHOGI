'use client';

import { useReducer, type Dispatch } from 'react';

import {
  createInitialGameState,
  gameReducer,
} from '@/hooks/game/gameReducer';

import type { GameAction } from '@/hooks/game/types';
import type { GameState } from '@/domain/game/types';

/**
 * ゲーム状態を useReducer で管理するフック。
 * @returns [ゲーム状態, dispatch 関数] のタプル
 */
export function useGameReducer(): [GameState, Dispatch<GameAction>] {
  return useReducer(gameReducer, undefined, createInitialGameState);
}
