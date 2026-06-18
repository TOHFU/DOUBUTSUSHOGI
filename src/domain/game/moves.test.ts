import { describe, expect, it } from 'vitest';

import { getDropMoves, getMovesForPiece } from '@/domain/game/moves';
import type { Board } from '@/domain/game/types';

describe('moves', () => {
  it('ニワトリは斜め後ろ以外の周囲6マスに動ける', () => {
    const board: Board = [
      [null, null, null],
      [null, null, null],
      [null, { kind: 'chicken', owner: 'green' }, null],
      [null, null, null],
    ];

    const moves = getMovesForPiece(board, { row: 2, col: 1 });

    expect(moves).toEqual([
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
      { row: 3, col: 1 },
    ]);
  });

  it('あおのニワトリは斜め後ろ（上方向）を除いて動ける', () => {
    const board: Board = [
      [null, null, null],
      [null, { kind: 'chicken', owner: 'blue' }, null],
      [null, null, null],
      [null, null, null],
    ];

    const moves = getMovesForPiece(board, { row: 1, col: 1 });

    expect(moves).not.toContainEqual({ row: 0, col: 0 });
    expect(moves).not.toContainEqual({ row: 0, col: 2 });
    expect(moves).toContainEqual({ row: 0, col: 1 });
    expect(moves).toHaveLength(6);
  });

  it('キリンは前方・後方・左右の4マスに動ける', () => {
    const board: Board = [
      [null, null, null],
      [null, { kind: 'giraffe', owner: 'green' }, null],
      [null, null, null],
      [null, null, null],
    ];

    const moves = getMovesForPiece(board, { row: 1, col: 1 });

    expect(moves).toEqual([
      { row: 0, col: 1 },
      { row: 2, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
    ]);
  });

  it('持ち駒は空いているマスすべてに置ける', () => {
    const board: Board = [
      [null, null, null],
      [null, { kind: 'lion', owner: 'blue' }, null],
      [null, null, null],
      [null, null, null],
    ];

    const moves = getDropMoves(board);

    expect(moves).toContainEqual({ row: 3, col: 0 });
    expect(moves).toContainEqual({ row: 3, col: 1 });
    expect(moves).toContainEqual({ row: 3, col: 2 });
    expect(moves).toHaveLength(11);
  });
});
