import { createInitialBoard, getOpponent } from '@/domain/game/board';
import { findLion } from '@/domain/game/moves';
import { HUMAN_PLAYER } from '@/domain/game/constants';
import type {
  GamePhase,
  GameState,
  PieceKind,
  Player,
} from '@/domain/game/types';

/** 対局が終了したフェーズ（メニュー・開始・勝敗）かどうかを判定する */
export function isTerminalPhase(phase: GamePhase): boolean {
  return (
    phase === 'menu' ||
    phase === 'gameStart' ||
    phase === 'youWin' ||
    phase === 'youLose'
  );
}

/** メニュー画面用の初期ゲーム状態を生成する */
export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: HUMAN_PLAYER,
    phase: 'menu',
    difficulty: null,
    selectedPosition: null,
    highlightedPositions: [],
    captured: { blue: [], green: [] },
    placingPiece: null,
    winner: null,
  };
}

/** 選択状態をリセットし playing フェーズへ遷移する */
export function toPlayingState(state: GameState): GameState {
  return {
    ...state,
    phase: 'playing',
    selectedPosition: null,
    highlightedPositions: [],
    placingPiece: null,
  };
}

/** 勝者に応じた結果フェーズを返す（人間勝利=youWin、CPU勝利=youLose） */
export function toResultPhase(winner: Player): GamePhase {
  return winner === HUMAN_PLAYER ? 'youWin' : 'youLose';
}

/**
 * 駒を取った際の持ち駒リストを更新する。
 * ニワトリはヒヨコに戻して相手の持ち駒に追加する。
 */
export function handleCapture(
  state: GameState,
  capturedKind: PieceKind,
  capturer: Player,
): GameState['captured'] {
  const demotedKind = capturedKind === 'chicken' ? 'chick' : capturedKind;

  return {
    ...state.captured,
    [capturer]: [...state.captured[capturer], demotedKind],
  };
}

/**
 * 盤面上のライオンの有無から勝者を判定する。
 * どちらかのライオンが盤上にいなければ、相手プレイヤーの勝利。
 */
export function resolveWinner(board: GameState['board']): Player | null {
  const blueLion = findLion(board, 'blue');
  const greenLion = findLion(board, 'green');

  if (!blueLion) {
    return 'green';
  }

  if (!greenLion) {
    return 'blue';
  }

  return null;
}

/** 難易度を引き継いで新規対局を開始する */
export function startGame(state: GameState): GameState {
  return toPlayingState({
    ...createInitialGameState(),
    difficulty: state.difficulty,
    captured: state.captured,
  });
}

/** メニュー画面へ戻す（全状態をリセット） */
export function retryGame(): GameState {
  return createInitialGameState();
}

/** 持ち駒リストから打ち込んだ駒を1つ消費する */
export function consumeCapturedPiece(
  state: GameState,
  piece: PieceKind,
  owner: Player,
): GameState {
  return {
    ...state,
    captured: {
      ...state.captured,
      [owner]: state.captured[owner].filter((kind, index, list) => {
        const firstIndex = list.indexOf(piece);
        return !(kind === piece && index === firstIndex);
      }),
    },
  };
}

/** 手番を相手プレイヤーに交代する */
export function switchTurn(state: GameState): Player {
  return getOpponent(state.currentPlayer);
}
