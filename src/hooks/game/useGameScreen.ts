'use client';

import { useLayoutEffect, useState } from 'react';

import { useGameController } from '@/hooks/game/useGameController';
import { useGamePhase } from '@/hooks/game/useGamePhase';
import { HUMAN_PLAYER } from '@/domain/game/constants';

/** GameScreen の状態配線とフェーズ判定をまとめたフック */
export function useGameScreen() {
  const controller = useGameController();
  const phase = useGamePhase(controller.state);
  const [isScreenVisible, setIsScreenVisible] = useState(false);

  useLayoutEffect(() => {
    setIsScreenVisible(true);
  }, []);

  const { state } = controller;

  return {
    ...controller,
    phase,
    playfieldClassName: phase.isMenuOpen
      ? 'game-screen__playfield game-screen__playfield--menu-hidden'
      : 'game-screen__playfield',
    boardProps: {
      board: state.board,
      selectedPosition: state.selectedPosition,
      highlightedPositions: state.highlightedPositions,
      onSelectSquare: controller.selectSquare,
    },
    cpuPlayerAreaProps: {
      player: 'blue' as const,
      capturedPieces: state.captured.blue,
      isActive: false,
    },
    humanPlayerAreaProps: {
      player: 'green' as const,
      capturedPieces: state.captured.green,
      placingPiece:
        state.currentPlayer === HUMAN_PLAYER ? state.placingPiece : null,
      isActive: phase.isHumanCapturingActive,
      onSelectCaptured: controller.selectCaptured,
    },
    menuProps: {
      open: phase.isMenuOpen,
      fadeVisible: isScreenVisible,
      onSelectDifficulty: controller.selectDifficulty,
    },
    gameStartProps: {
      open: phase.isGameStartOpen,
      onStart: controller.start,
    },
    youWinProps: {
      open: phase.isYouWinOpen,
      variant: 'youWin' as const,
      onRetry: controller.retry,
    },
    youLoseProps: {
      open: phase.isYouLoseOpen,
      variant: 'youLose' as const,
      onRetry: controller.retry,
    },
  };
}
