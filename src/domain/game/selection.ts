import {
  getDropMoves,
  getMovesForPiece,
  isPositionInList,
} from '@/domain/game/moves';
import { positionsEqual } from '@/domain/game/board';
import { applyMoveWithCapture, executeMove } from '@/domain/game/turn';
import { isTerminalPhase, toPlayingState } from '@/domain/game/stateHelpers';
import type { GameState, PieceKind, Position } from '@/domain/game/types';

/**
 * 盤面のマスを選択したときの状態遷移を処理する。
 * @param state - 選択前のゲーム状態
 * @param position - 選択されたマスの座標
 * @returns 選択後のゲーム状態
 */
export function selectBoardSquare(
  state: GameState,
  position: Position,
): GameState {
  if (isTerminalPhase(state.phase)) {
    return state;
  }

  if (state.phase === 'havePieceSelect' && state.placingPiece) {
    if (isPositionInList(position, state.highlightedPositions)) {
      return applyMoveWithCapture(state, {
        from: null,
        to: position,
        piece: state.placingPiece,
      });
    }

    const piece = state.board[position.row]?.[position.col];

    if (piece && piece.owner === state.currentPlayer) {
      return {
        ...state,
        phase: 'pieceSelect',
        selectedPosition: position,
        highlightedPositions: getMovesForPiece(state.board, position),
        placingPiece: null,
      };
    }

    return toPlayingState(state);
  }

  if (state.phase === 'pieceSelect' && state.selectedPosition) {
    if (positionsEqual(position, state.selectedPosition)) {
      return toPlayingState(state);
    }

    if (isPositionInList(position, state.highlightedPositions)) {
      const piece = state.board[state.selectedPosition.row]?.[
        state.selectedPosition.col
      ];

      if (!piece) {
        return toPlayingState(state);
      }

      return executeMove(state, {
        from: state.selectedPosition,
        to: position,
        piece: piece.kind,
      });
    }
  }

  const piece = state.board[position.row]?.[position.col];

  if (!piece || piece.owner !== state.currentPlayer) {
    return toPlayingState(state);
  }

  return {
    ...state,
    phase: 'pieceSelect',
    selectedPosition: position,
    highlightedPositions: getMovesForPiece(state.board, position),
    placingPiece: null,
  };
}

/**
 * 持ち駒を選択したときの状態遷移を処理する。
 * @param state - 選択前のゲーム状態
 * @param piece - 選択された持ち駒の種類
 * @returns 選択後のゲーム状態。打てる空マスをハイライトする
 */
export function selectCapturedPiece(
  state: GameState,
  piece: PieceKind,
): GameState {
  if (
    state.phase !== 'playing' &&
    state.phase !== 'pieceSelect' &&
    state.phase !== 'havePieceSelect'
  ) {
    return state;
  }

  const available = state.captured[state.currentPlayer];

  if (!available.includes(piece)) {
    return toPlayingState(state);
  }

  if (state.phase === 'havePieceSelect' && state.placingPiece === piece) {
    return toPlayingState(state);
  }

  return {
    ...state,
    phase: 'havePieceSelect',
    selectedPosition: null,
    placingPiece: piece,
    highlightedPositions: getDropMoves(state.board),
  };
}
