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

/**
 * 1手を実行し、取り駒・手番交代・勝敗判定を反映した新しい状態を返す。
 * 勝者が確定した場合は結果フェーズへ遷移する。
 */
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

/**
 * 持ち駒の打ち込みを含む手の実行。
 * 打ち駒の場合は持ち駒リストから消費する。
 */
export function applyMoveWithCapture(state: GameState, move: Move): GameState {
  const mover = state.currentPlayer;
  const nextState = executeMove(state, move);

  if (move.from === null) {
    return consumeCapturedPiece(nextState, move.piece, mover);
  }

  return nextState;
}
