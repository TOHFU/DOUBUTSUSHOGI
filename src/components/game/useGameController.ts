'use client';

import { useEffect, useReducer } from 'react';

import { isHumanTurn } from '@/components/game/gamePhase';
import {
  createInitialGameState,
  pickCpuMove,
  retryGame,
  selectBoardSquare,
  selectCapturedPiece,
  startGame,
} from '@/domain/game/game';
import { HUMAN_PLAYER } from '@/domain/game/constants';
import { isTerminalPhase } from '@/domain/game/stateHelpers';
import type { GameState, PieceKind, Position } from '@/domain/game/types';

type GameAction =
  | { type: 'start' }
  | { type: 'retry' }
  | { type: 'selectSquare'; position: Position }
  | { type: 'selectCaptured'; piece: PieceKind }
  | { type: 'cpuMove' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
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

const CPU_MOVE_DELAY_MS = 500;

export function useGameController() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState,
  );

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
  }, [state.currentPlayer, state.phase, state.board, state.captured]);

  const selectSquare = (position: Position) => {
    if (!isHumanTurn(state)) {
      return;
    }

    dispatch({ type: 'selectSquare', position });
  };

  const selectCaptured = (piece: PieceKind) => {
    if (!isHumanTurn(state)) {
      return;
    }

    dispatch({ type: 'selectCaptured', piece });
  };

  return {
    state,
    start: () => dispatch({ type: 'start' }),
    retry: () => dispatch({ type: 'retry' }),
    selectSquare,
    selectCaptured,
  };
}
