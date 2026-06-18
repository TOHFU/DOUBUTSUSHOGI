import { CPU_PLAYER, HUMAN_PLAYER } from '@/domain/game/constants';
import { hardMovePicker } from '@/domain/game/cpuStrategy';
import { getDropMoves, getMovesForPiece } from '@/domain/game/moves';
import { applyMoveWithCapture, executeMove } from '@/domain/game/turn';
import { toResultPhase } from '@/domain/game/stateHelpers';
import {
  BOARD_COLS,
  BOARD_ROWS,
  type GameState,
  type Move,
  type Position,
} from '@/domain/game/types';

export type MovePicker = (candidates: Move[], state: GameState) => Move;

function collectBoardMoves(state: GameState): Move[] {
  const boardMoves: Move[] = [];

  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const from: Position = { row, col };
      const piece = state.board[row]?.[col];

      if (piece?.owner !== CPU_PLAYER) {
        continue;
      }

      for (const to of getMovesForPiece(state.board, from)) {
        boardMoves.push({ from, to, piece: piece.kind });
      }
    }
  }

  return boardMoves;
}

function collectDropMoves(state: GameState): Move[] {
  return state.captured.blue.flatMap((piece) =>
    getDropMoves(state.board).map((to) => ({
      from: null as Position | null,
      to,
      piece,
    })),
  );
}

export function defaultMovePicker(
  candidates: Move[],
  state: GameState,
  random = Math.random,
): Move {
  const lionCapture = candidates.find((move) => {
    const target = state.board[move.to.row]?.[move.to.col];
    return target?.kind === 'lion' && target.owner === HUMAN_PLAYER;
  });

  return lionCapture ?? candidates[Math.floor(random() * candidates.length)]!;
}

export function pickCpuMove(state: GameState): GameState {
  if (state.currentPlayer !== CPU_PLAYER) {
    return state;
  }

  const pickMove: MovePicker =
    state.difficulty === 'hard'
      ? (candidates, currentState) => hardMovePicker(candidates, currentState)
      : (candidates, currentState) =>
          defaultMovePicker(candidates, currentState);

  const candidates = [...collectBoardMoves(state), ...collectDropMoves(state)];

  if (candidates.length === 0) {
    return {
      ...state,
      phase: toResultPhase(HUMAN_PLAYER),
      winner: HUMAN_PLAYER,
    };
  }

  const move = pickMove(candidates, state);

  if (move.from === null) {
    return applyMoveWithCapture(
      {
        ...state,
        phase: 'havePieceSelect',
        placingPiece: move.piece,
        highlightedPositions: getDropMoves(state.board),
      },
      move,
    );
  }

  return executeMove(
    {
      ...state,
      phase: 'pieceSelect',
      selectedPosition: move.from,
      highlightedPositions: getMovesForPiece(state.board, move.from),
    },
    move,
  );
}
