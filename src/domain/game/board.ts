import {
  BOARD_COLS,
  BOARD_ROWS,
  type Board,
  type Cell,
  type Piece,
  type Player,
  type Position,
} from '@/domain/game/types';

/** 標準初期配置（上段=あお、下段=みどり） */
export function createInitialBoard(): Board {
  return [
    [
      { kind: 'giraffe', owner: 'blue' },
      { kind: 'lion', owner: 'blue' },
      { kind: 'elephant', owner: 'blue' },
    ],
    [null, { kind: 'chick', owner: 'blue' }, null],
    [null, { kind: 'chick', owner: 'green' }, null],
    [
      { kind: 'elephant', owner: 'green' },
      { kind: 'lion', owner: 'green' },
      { kind: 'giraffe', owner: 'green' },
    ],
  ].map((row) => [...row]) as Board;
}

export function isInsideBoard({ row, col }: Position): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function getCell(board: Board, position: Position): Cell {
  return board[position.row]?.[position.col] ?? null;
}

export function setCell(board: Board, position: Position, cell: Cell): Board {
  return board.map((row, rowIndex) =>
    row.map((piece, colIndex) =>
      rowIndex === position.row && colIndex === position.col ? cell : piece,
    ),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function getOpponent(player: Player): Player {
  return player === 'blue' ? 'green' : 'blue';
}

export function isPromotionZone(player: Player, row: number): boolean {
  return player === 'blue' ? row === BOARD_ROWS - 1 : row === 0;
}

export function maybePromote(piece: Piece, toRow: number): Piece {
  if (piece.kind !== 'chick') {
    return piece;
  }

  if (!isPromotionZone(piece.owner, toRow)) {
    return piece;
  }

  return { ...piece, kind: 'chicken' };
}
