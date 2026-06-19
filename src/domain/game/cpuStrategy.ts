import { getCell } from '@/domain/game/board';
import { CPU_PLAYER, HUMAN_PLAYER } from '@/domain/game/constants';
import { applyMove, findLion, getMovesForPiece } from '@/domain/game/moves';
import {
  BOARD_COLS,
  BOARD_ROWS,
  type Board,
  type Move,
  type PieceKind,
  type Player,
  type Position,
} from '@/domain/game/types';
import type { GameState } from '@/domain/game/types';

/** 駒種ごとの評価値（hard 難易度の手番評価に使用） */
const PIECE_VALUES: Record<PieceKind, number> = {
  lion: 10000,
  giraffe: 400,
  elephant: 400,
  chicken: 250,
  chick: 150,
};

/**
 * 指定プレイヤーが相手のライオンを次の手で取れるかどうかを判定する。
 * @param board - 判定対象の盤面
 * @param attacker - 攻撃側プレイヤー
 * @param defender - 防御側プレイヤー
 * @returns 次の手でライオンを取れる場合 true
 */
function canPlayerCaptureLion(
  board: Board,
  attacker: Player,
  defender: Player,
): boolean {
  const lionPos = findLion(board, defender);
  if (!lionPos) {
    return false;
  }

  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const from = { row, col };
      const piece = getCell(board, from);

      if (piece?.owner !== attacker) {
        continue;
      }

      if (
        getMovesForPiece(board, from).some(
          (position) =>
            position.row === lionPos.row && position.col === lionPos.col,
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 2座標間のマンハッタン距離を返す。
 * @param a - 始点座標
 * @param b - 終点座標
 * @returns マンハッタン距離
 */
function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * hard 難易度向けに1手の評価スコアを算出する。
 * @param state - 現在のゲーム状態
 * @param move - 評価対象の手
 * @returns 評価スコア（高いほど有利）
 */
function scoreMove(state: GameState, move: Move): number {
  const target = getCell(state.board, move.to);
  const nextBoard = applyMove(state.board, move, CPU_PLAYER);
  let score = 0;

  if (target?.kind === 'lion' && target.owner === HUMAN_PLAYER) {
    return 100000;
  }

  if (target) {
    score += PIECE_VALUES[target.kind];
  }

  if (canPlayerCaptureLion(nextBoard, HUMAN_PLAYER, CPU_PLAYER)) {
    score -= 50000;
  }

  if (canPlayerCaptureLion(nextBoard, CPU_PLAYER, HUMAN_PLAYER)) {
    score += 8000;
  }

  if (move.from === null) {
    const humanLion = findLion(nextBoard, HUMAN_PLAYER);
    if (humanLion) {
      score += Math.max(0, 12 - manhattan(move.to, humanLion)) * 30;
    }
  } else {
    const humanLion = findLion(nextBoard, HUMAN_PLAYER);
    if (humanLion) {
      score += Math.max(0, 10 - manhattan(move.to, humanLion)) * 15;
    }
  }

  if (move.piece === 'lion') {
    score -= 1000;
  }

  return score;
}

/**
 * hard 難易度の手番選択。
 * @param candidates - 合法手の候補一覧
 * @param state - 現在のゲーム状態
 * @returns 評価スコアが最も高い手のうち1手
 */
export function hardMovePicker(candidates: Move[], state: GameState): Move {
  const scored = candidates.map((move) => ({
    move,
    score: scoreMove(state, move),
  }));

  scored.sort((a, b) => b.score - a.score);

  const bestScore = scored[0]?.score ?? 0;
  const bestMoves = scored
    .filter((entry) => entry.score === bestScore)
    .map((entry) => entry.move);

  return bestMoves[Math.floor(Math.random() * bestMoves.length)]!;
}
