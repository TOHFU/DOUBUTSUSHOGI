import {
  BOARD_COLS,
  BOARD_ROWS,
  type Board,
  type Cell,
  type Piece,
  type Player,
  type Position,
} from '@/domain/game/types';

/**
 * 標準初期配置の盤面を生成する。
 * 上段が blue（CPU）、下段が green（人間）。
 */
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

/** 座標が盤面内かどうかを判定する */
export function isInsideBoard({ row, col }: Position): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

/** 2つの座標が同一マスかどうかを判定する */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

/** 指定座標のマス内容を取得する（範囲外は null） */
export function getCell(board: Board, position: Position): Cell {
  return board[position.row]?.[position.col] ?? null;
}

/** 指定座標のマス内容を更新した新しい盤面を返す（イミュータブル） */
export function setCell(board: Board, position: Position, cell: Cell): Board {
  return board.map((row, rowIndex) =>
    row.map((piece, colIndex) =>
      rowIndex === position.row && colIndex === position.col ? cell : piece,
    ),
  );
}

/** 盤面のディープコピーを作成する */
export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

/** 対戦相手のプレイヤーを返す */
export function getOpponent(player: Player): Player {
  return player === 'blue' ? 'green' : 'blue';
}

/**
 * 指定プレイヤーの成りゾーン（相手陣地の最奥段）かどうかを判定する。
 * blue は最下段、green は最上段が成りゾーン。
 */
export function isPromotionZone(player: Player, row: number): boolean {
  return player === 'blue' ? row === BOARD_ROWS - 1 : row === 0;
}

/**
 * ヒヨコが成りゾーンに入った場合にニワトリへ成る。
 * それ以外は駒をそのまま返す。
 */
export function maybePromote(piece: Piece, toRow: number): Piece {
  if (piece.kind !== 'chick') {
    return piece;
  }

  if (!isPromotionZone(piece.owner, toRow)) {
    return piece;
  }

  return { ...piece, kind: 'chicken' };
}
