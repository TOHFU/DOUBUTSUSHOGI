import { useMemo } from 'react';

import { HUMAN_PLAYER } from '@/domain/game/constants';
import { isTerminalPhase } from '@/domain/game/stateHelpers';
import type { GamePhase, GameState } from '@/domain/game/types';

/**
 * 人間プレイヤーの手番かどうかを判定する。
 * @param state - 現在のゲーム状態
 * @returns 人間の手番であれば true
 */
export function isHumanTurn(state: GameState): boolean {
  return state.currentPlayer === HUMAN_PLAYER;
}

/**
 * 人間プレイヤーが持ち駒を操作できる状態かどうかを判定する。
 * @param state - 現在のゲーム状態
 * @returns 持ち駒操作可能であれば true
 */
export function isHumanCapturingActive(state: GameState): boolean {
  return isHumanTurn(state) && !isTerminalPhase(state.phase);
}

/**
 * 勝敗結果フェーズかどうかを判定する。
 * @param phase - 判定するフェーズ
 * @returns 勝敗フェーズであれば true
 */
export function isResultPhase(phase: GamePhase): boolean {
  return phase === 'youWin' || phase === 'youLose';
}

/**
 * オーバーレイ表示中のフェーズかどうかを判定する。
 * @param phase - 判定するフェーズ
 * @returns オーバーレイ表示中であれば true
 */
export function isOverlayPhase(phase: GamePhase): boolean {
  return (
    phase === 'menu' ||
    phase === 'gameStart' ||
    phase === 'youWin' ||
    phase === 'youLose'
  );
}

/**
 * ゲームフェーズに基づく UI 表示状態を導出するフック。
 * @param state - 現在のゲーム状態
 * @returns UI 表示用のフェーズ判定オブジェクト
 */
export function useGamePhase(state: GameState) {
  return useMemo(
    () => ({
      isHumanTurn: isHumanTurn(state),
      isHumanCapturingActive: isHumanCapturingActive(state),
      isResultPhase: isResultPhase(state.phase),
      isOverlayPhase: isOverlayPhase(state.phase),
      isMenuOpen: state.phase === 'menu',
      isGameStartOpen: state.phase === 'gameStart',
      isYouWinOpen: state.phase === 'youWin',
      isYouLoseOpen: state.phase === 'youLose',
      resultAnnouncement:
        state.phase === 'youWin'
          ? 'YOU WIN'
          : state.phase === 'youLose'
            ? 'YOU LOSE'
            : null,
    }),
    [state],
  );
}
