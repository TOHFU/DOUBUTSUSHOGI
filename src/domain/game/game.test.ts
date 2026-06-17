import { describe, expect, it } from 'vitest';

import { createInitialBoard, getCell } from '@/domain/game/board';
import {
  createInitialGameState,
  pickCpuMove,
  selectBoardSquare,
  selectCapturedPiece,
  startGame,
} from '@/domain/game/game';

describe('game', () => {
  it('初期盤面を生成する', () => {
    const board = createInitialBoard();

    expect(getCell(board, { row: 0, col: 1 })?.kind).toBe('lion');
    expect(getCell(board, { row: 1, col: 1 })?.kind).toBe('chick');
    expect(getCell(board, { row: 2, col: 1 })?.kind).toBe('chick');
    expect(getCell(board, { row: 3, col: 1 })?.kind).toBe('lion');
  });

  it('駒を選択すると移動可能マスがハイライトされる', () => {
    const state = startGame(createInitialGameState());
    const next = selectBoardSquare(state, { row: 3, col: 2 });

    expect(next.phase).toBe('pieceSelect');
    expect(next.highlightedPositions.length).toBeGreaterThan(0);
  });

  it('ライオンを取ると勝利になる', () => {
    const state = {
      ...startGame(createInitialGameState()),
      board: [
        [null, null, null],
        [null, { kind: 'lion', owner: 'blue' }, null],
        [null, { kind: 'lion', owner: 'green' }, null],
        [null, null, null],
      ],
      currentPlayer: 'green' as const,
      phase: 'pieceSelect' as const,
      selectedPosition: { row: 2, col: 1 },
      highlightedPositions: [{ row: 1, col: 1 }],
      captured: { blue: [], green: [] },
      placingPiece: null,
      winner: null,
    };

    const result = selectBoardSquare(state, { row: 1, col: 1 });

    expect(result.phase).toBe('youWin');
  });

  it('CPUの手番を進められる', () => {
    const state = startGame(createInitialGameState());
    const afterCpu = pickCpuMove({
      ...state,
      currentPlayer: 'blue',
    });

    expect(afterCpu.currentPlayer).toBe('green');
  });

  it('持ち駒を盤に置くと手元から消える', () => {
    const state = {
      ...startGame(createInitialGameState()),
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      currentPlayer: 'green' as const,
      phase: 'havePieceSelect' as const,
      selectedPosition: null,
      highlightedPositions: [{ row: 2, col: 0 }],
      captured: { blue: [], green: ['giraffe'] },
      placingPiece: 'giraffe' as const,
      winner: null,
    };

    const result = selectBoardSquare(state, { row: 2, col: 0 });

    expect(result.captured.green).toEqual([]);
    expect(result.board[2][0]).toEqual({ kind: 'giraffe', owner: 'green' });
  });

  it('持ち駒を一番下の行に置ける', () => {
    const state = {
      ...startGame(createInitialGameState()),
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      currentPlayer: 'green' as const,
      phase: 'havePieceSelect' as const,
      selectedPosition: null,
      highlightedPositions: [{ row: 3, col: 1 }],
      captured: { blue: [], green: ['chick'] },
      placingPiece: 'chick' as const,
      winner: null,
    };

    const result = selectBoardSquare(state, { row: 3, col: 1 });

    expect(result.board[3][1]).toEqual({ kind: 'chick', owner: 'green' });
    expect(result.captured.green).toEqual([]);
  });

  it('持ち駒のひよこを相手陣地に置いても成らない', () => {
    const state = {
      ...startGame(createInitialGameState()),
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      currentPlayer: 'green' as const,
      phase: 'havePieceSelect' as const,
      selectedPosition: null,
      highlightedPositions: [{ row: 0, col: 1 }],
      captured: { blue: [], green: ['chick'] },
      placingPiece: 'chick' as const,
      winner: null,
    };

    const result = selectBoardSquare(state, { row: 0, col: 1 });

    expect(result.board[0][1]).toEqual({ kind: 'chick', owner: 'green' });
    expect(result.captured.green).toEqual([]);
  });

  it('選択中の駒を再度クリックすると選択解除される', () => {
    const state = startGame(createInitialGameState());
    const selected = selectBoardSquare(state, { row: 3, col: 2 });
    const deselected = selectBoardSquare(selected, { row: 3, col: 2 });

    expect(deselected.phase).toBe('playing');
    expect(deselected.selectedPosition).toBeNull();
  });

  it('選択中の持ち駒を再度クリックすると選択解除される', () => {
    const state = {
      ...startGame(createInitialGameState()),
      captured: { blue: [], green: ['chick'] },
      currentPlayer: 'green' as const,
    };
    const selected = selectCapturedPiece(state, 'chick');
    const deselected = selectCapturedPiece(selected, 'chick');

    expect(deselected.phase).toBe('playing');
    expect(deselected.placingPiece).toBeNull();
  });

  it('持ち駒選択中に盤上の駒を選択できる', () => {
    const state = {
      ...startGame(createInitialGameState()),
      captured: { blue: [], green: ['chick'] },
      currentPlayer: 'green' as const,
      phase: 'havePieceSelect' as const,
      placingPiece: 'chick' as const,
      highlightedPositions: [{ row: 2, col: 0 }],
    };
    const next = selectBoardSquare(state, { row: 3, col: 2 });

    expect(next.phase).toBe('pieceSelect');
    expect(next.placingPiece).toBeNull();
    expect(next.selectedPosition).toEqual({ row: 3, col: 2 });
  });
});
