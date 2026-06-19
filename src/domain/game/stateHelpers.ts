import { createInitialBoard, getOpponent } from '@/domain/game/board';
import { findLion } from '@/domain/game/moves';
import { HUMAN_PLAYER } from '@/domain/game/constants';
import type {
  GamePhase,
  GameState,
  PieceKind,
  Player,
} from '@/domain/game/types';

/**
 * 対局が終了したフェーズかどうかを判定する。
 * @param phase - 判定するフェーズ
 * @returns メニュー・開始・勝敗フェーズであれば true
 */
export function isTerminalPhase(phase: GamePhase): boolean {
  return (
    phase === 'menu' ||
    phase === 'gameStart' ||
    phase === 'youWin' ||
    phase === 'youLose'
  );
}

/**
 * メニュー画面用の初期ゲーム状態を生成する。
 * @returns 初期化されたゲーム状態
 */
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

/**
 * 選択状態をリセットし playing フェーズへ遷移する。
 * @param state - 遷移前のゲーム状態
 * @returns playing フェーズのゲーム状態
 */
export function toPlayingState(state: GameState): GameState {
  return {
    ...state,
    phase: 'playing',
    selectedPosition: null,
    highlightedPositions: [],
    placingPiece: null,
  };
}

/**
 * 勝者に応じた結果フェーズを返す。
 * @param winner - 勝利したプレイヤー
 * @returns 人間勝利なら youWin、CPU 勝利なら youLose
 */
export function toResultPhase(winner: Player): GamePhase {
  return winner === HUMAN_PLAYER ? 'youWin' : 'youLose';
}

/**
 * 駒を取った際の持ち駒リストを更新する。
 * @param state - 取る前のゲーム状態
 * @param capturedKind - 取った駒の種類
 * @param capturer - 駒を取ったプレイヤー
 * @returns 更新後の持ち駒マップ
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
 * @param board - 判定対象の盤面
 * @returns 勝者。未決定の場合は null
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

/**
 * 難易度を引き継いで新規対局を開始する。
 * @param state - 開始前のゲーム状態
 * @returns 対局開始後のゲーム状態
 */
export function startGame(state: GameState): GameState {
  return toPlayingState({
    ...createInitialGameState(),
    difficulty: state.difficulty,
    captured: state.captured,
  });
}

/**
 * メニュー画面へ戻す。
 * @returns リセットされた初期ゲーム状態
 */
export function retryGame(): GameState {
  return createInitialGameState();
}

/**
 * 持ち駒リストから打ち込んだ駒を1つ消費する。
 * @param state - 消費前のゲーム状態
 * @param piece - 消費する駒の種類
 * @param owner - 持ち駒の所有者
 * @returns 持ち駒を消費した後のゲーム状態
 */
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

/**
 * 手番を相手プレイヤーに交代する。
 * @param state - 交代前のゲーム状態
 * @returns 次の手番のプレイヤー
 */
export function switchTurn(state: GameState): Player {
  return getOpponent(state.currentPlayer);
}
