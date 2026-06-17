import {
  cloneBoard,
  getCell,
  getOpponent,
  isInsideBoard,
  maybePromote,
  positionsEqual,
  setCell,
} from '@/domain/game/board';
import {
  BOARD_COLS,
  BOARD_ROWS,
  type Board,
  type Move,
  type PieceKind,
  type Player,
  type Position,
} from '@/domain/game/types';

type Direction = { row: number; col: number };

function forwardDirection(player: Player): Direction {
  return player === 'blue' ? { row: 1, col: 0 } : { row: -1, col: 0 };
}

function addDirection(position: Position, direction: Direction): Position {
  return {
    row: position.row + direction.row,
    col: position.col + direction.col,
  };
}

function getMoveDirections(kind: PieceKind, player: Player): Direction[] {
  const forward = forwardDirection(player);

  switch (kind) {
    case 'lion':
      return [
        forward,
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ];
    case 'elephant':
      return [
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ];
    case 'giraffe':
      return [forward, { row: 0, col: -1 }, { row: 0, col: 1 }];
    case 'chick':
      return [forward];
    case 'chicken': {
      const backRow = -forward.row;
      const diagonalBacks: Direction[] = [
        { row: backRow, col: -1 },
        { row: backRow, col: 1 },
      ];

      return [
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ].filter(
        (direction) =>
          !diagonalBacks.some(
            (back) =>
              back.row === direction.row && back.col === direction.col,
          ),
      );
    }
    default:
      return [];
  }
}

function canMoveTo(
  board: Board,
  player: Player,
  position: Position,
): boolean {
  if (!isInsideBoard(position)) {
    return false;
  }

  const target = getCell(board, position);
  return target === null || target.owner !== player;
}

export function getMovesForPiece(
  board: Board,
  from: Position,
): Position[] {
  const piece = getCell(board, from);

  if (!piece) {
    return [];
  }

  return getMoveDirections(piece.kind, piece.owner)
    .map((direction) => addDirection(from, direction))
    .filter((position) => canMoveTo(board, piece.owner, position));
}

export function getDropMoves(board: Board): Position[] {
  const positions: Position[] = [];

  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const position = { row, col };

      if (getCell(board, position) === null) {
        positions.push(position);
      }
    }
  }

  return positions;
}

export function applyMove(board: Board, move: Move, player: Player): Board {
  let nextBoard = cloneBoard(board);

  if (move.from) {
    nextBoard = setCell(nextBoard, move.from, null);
  }

  const movingPiece = {
    kind: move.piece,
    owner: player,
  };

  nextBoard = setCell(
    nextBoard,
    move.to,
    move.from === null
      ? movingPiece
      : maybePromote(movingPiece, move.to.row),
  );

  return nextBoard;
}

export function findLion(board: Board, player: Player): Position | null {
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const piece = getCell(board, { row, col });

      if (piece?.kind === 'lion' && piece.owner === player) {
        return { row, col };
      }
    }
  }

  return null;
}

export function hasLegalMoves(board: Board, player: Player): boolean {
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const position = { row, col };
      const piece = getCell(board, position);

      if (piece?.owner === player && getMovesForPiece(board, position).length > 0) {
        return true;
      }
    }
  }

  return false;
}

export function isPositionInList(
  position: Position,
  list: Position[],
): boolean {
  return list.some((item) => positionsEqual(item, position));
}

export { getOpponent };
