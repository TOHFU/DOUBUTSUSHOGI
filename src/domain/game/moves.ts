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

/** プレイヤー視点の前方方向を返す（blue=下、green=上） */
function forwardDirection(player: Player): Direction {
  return player === 'blue' ? { row: 1, col: 0 } : { row: -1, col: 0 };
}

/** 座標に方向ベクトルを加算する */
function addDirection(position: Position, direction: Direction): Position {
  return {
    row: position.row + direction.row,
    col: position.col + direction.col,
  };
}

/**
 * 駒種とプレイヤーに応じた移動方向の一覧を返す。
 * ライオンは前方+周囲8方向、ゾウは斜め4方向、キリンは前方+左右、
 * ヒヨコは前方1マス、ニワトリは斜め後ろを除く周囲6マス。
 */
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
      return [
        forward,
        { row: -forward.row, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];
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

/** 指定マスへ移動可能か（盤内かつ自駒でない）を判定する */
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

/**
 * 盤上の駒が移動可能なマス一覧を返す。
 * 空マスと相手駒のマスを含む。
 */
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

/** 持ち駒を打てる空マスの一覧を返す */
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

/**
 * 1手を盤面に適用した新しい盤面を返す。
 * 移動元を空にし、移動先に駒を配置する。成り判定も行う。
 */
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

/** 指定プレイヤーのライオンの位置を探索する。存在しない場合は null */
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

/** 座標がリスト内に含まれるかどうかを判定する */
export function isPositionInList(
  position: Position,
  list: Position[],
): boolean {
  return list.some((item) => positionsEqual(item, position));
}

export { getOpponent };
