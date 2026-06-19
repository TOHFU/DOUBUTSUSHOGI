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

/** 指定プレイヤーが相手のライオンを次の手で取れるかどうかを判定する */
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

/** 2座標間のマンハッタン距離 */
function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * hard 難易度向けに1手の評価スコアを算出する。
 * ライオン捕獲・駒得・自ライオン危険・相手ライオンへの接近を考慮する。
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
 * 全候補手を評価し、最高スコアの手からランダムに1手選ぶ。
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
