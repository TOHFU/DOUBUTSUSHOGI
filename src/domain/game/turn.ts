import { applyMove } from '@/domain/game/moves';
import {
  consumeCapturedPiece,
  handleCapture,
  resolveWinner,
  switchTurn,
  toPlayingState,
  toResultPhase,
} from '@/domain/game/stateHelpers';
import type { GameState, Move } from '@/domain/game/types';

export function executeMove(state: GameState, move: Move): GameState {
  const target = state.board[move.to.row]?.[move.to.col] ?? null;
  const capturedKind = target?.kind;
  const nextBoard = applyMove(state.board, move, state.currentPlayer);
  const winner = resolveWinner(nextBoard);
  const nextPlayer = switchTurn(state);

  if (winner) {
    return {
      ...state,
      board: nextBoard,
      captured: capturedKind
        ? handleCapture(state, capturedKind, state.currentPlayer)
        : state.captured,
      currentPlayer: nextPlayer,
      phase: toResultPhase(winner),
      selectedPosition: null,
      highlightedPositions: [],
      placingPiece: null,
      winner,
    };
  }

  return {
    ...toPlayingState({
      ...state,
      board: nextBoard,
      captured: capturedKind
        ? handleCapture(state, capturedKind, state.currentPlayer)
        : state.captured,
      currentPlayer: nextPlayer,
      winner: null,
    }),
  };
}

export function applyMoveWithCapture(state: GameState, move: Move): GameState {
  const mover = state.currentPlayer;
  const nextState = executeMove(state, move);

  if (move.from === null) {
    return consumeCapturedPiece(nextState, move.piece, mover);
  }

  return nextState;
}
