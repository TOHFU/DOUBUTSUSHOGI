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
 * @returns 初期配置済みの盤面
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

/**
 * 座標が盤面内かどうかを判定する。
 * @param position - 判定対象の座標
 * @returns 盤面内であれば true
 */
export function isInsideBoard({ row, col }: Position): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

/**
 * 2つの座標が同一マスかどうかを判定する。
 * @param a - 比較元の座標
 * @param b - 比較先の座標
 * @returns 同一マスであれば true
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

/**
 * 指定座標のマス内容を取得する。
 * @param board - 対象の盤面
 * @param position - 取得する座標
 * @returns マスの駒。範囲外の場合は null
 */
export function getCell(board: Board, position: Position): Cell {
  return board[position.row]?.[position.col] ?? null;
}

/**
 * 指定座標のマス内容を更新した新しい盤面を返す。
 * @param board - 更新元の盤面
 * @param position - 更新する座標
 * @param cell - 配置するマス内容
 * @returns 更新後の盤面（イミュータブル）
 */
export function setCell(board: Board, position: Position, cell: Cell): Board {
  return board.map((row, rowIndex) =>
    row.map((piece, colIndex) =>
      rowIndex === position.row && colIndex === position.col ? cell : piece,
    ),
  );
}

/**
 * 盤面のディープコピーを作成する。
 * @param board - コピー元の盤面
 * @returns 独立したコピー
 */
export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

/**
 * 対戦相手のプレイヤーを返す。
 * @param player - 現在のプレイヤー
 * @returns 相手プレイヤー
 */
export function getOpponent(player: Player): Player {
  return player === 'blue' ? 'green' : 'blue';
}

/**
 * 指定プレイヤーの成りゾーン（相手陣地の最奥段）かどうかを判定する。
 * blue は最下段、green は最上段が成りゾーン。
 * @param player - 判定対象のプレイヤー
 * @param row - 判定する行番号
 * @returns 成りゾーンであれば true
 */
export function isPromotionZone(player: Player, row: number): boolean {
  return player === 'blue' ? row === BOARD_ROWS - 1 : row === 0;
}

/**
 * ヒヨコが成りゾーンに入った場合にニワトリへ成る。
 * @param piece - 移動する駒
 * @param toRow - 移動先の行番号
 * @returns 成り後（または変化なし）の駒
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
