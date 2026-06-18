'use client';

import { useLayoutEffect, useState } from 'react';

import { GameBoard } from '@/components/game/GameBoard';
import { GameStage } from '@/components/game/GameStage';
import { GameStartOverlay } from '@/components/game/GameStartOverlay';
import { MenuScreen } from '@/components/game/MenuScreen';
import { PlayerArea } from '@/components/game/PlayerArea';
import { ResultOverlay } from '@/components/game/ResultOverlay';
import { GAME_SCREEN_CLASS, GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';
import { isHumanCapturingActive, isOverlayPhase, isResultPhase } from '@/components/game/gamePhase';
import { useGameController } from '@/components/game/useGameController';
import { HUMAN_PLAYER } from '@/domain/game/constants';

export function GameScreen() {
  const { state, selectDifficulty, start, retry, selectSquare, selectCaptured } =
    useGameController();
  const overlayOpen = isOverlayPhase(state.phase);
  const [isScreenVisible, setIsScreenVisible] = useState(false);

  useLayoutEffect(() => {
    setIsScreenVisible(true);
  }, []);

  return (
    <main className={GAME_SCREEN_CLASS}>
      <div
        className="relative shrink-0"
        style={{
          width: gameSize(GAME_LAYOUT.frameWidth),
          height: gameSize(GAME_LAYOUT.frameHeight),
        }}
      >
        <div
          className={
            state.phase === 'menu'
              ? 'game-screen__playfield game-screen__playfield--menu-hidden'
              : 'game-screen__playfield'
          }
          inert={overlayOpen ? true : undefined}
        >
          <GameStage />

          <div className="relative flex h-full flex-col">
            <PlayerArea
              player="blue"
              capturedPieces={state.captured.blue}
              isActive={false}
              className="relative z-[1] shrink-0"
            />

            <section
              className="relative z-10 flex shrink-0 items-center justify-center"
              style={{ marginBlock: gameSize(-GAME_LAYOUT.board.overlapY) }}
              aria-label="対局エリア"
            >
              <GameBoard
                board={state.board}
                selectedPosition={state.selectedPosition}
                highlightedPositions={state.highlightedPositions}
                onSelectSquare={selectSquare}
              />
            </section>

            <PlayerArea
              player="green"
              capturedPieces={state.captured.green}
              placingPiece={
                state.currentPlayer === HUMAN_PLAYER ? state.placingPiece : null
              }
              isActive={isHumanCapturingActive(state)}
              onSelectCaptured={selectCaptured}
              className="relative z-[1] shrink-0"
            />
          </div>
        </div>

        <MenuScreen
          open={state.phase === 'menu'}
          fadeVisible={isScreenVisible}
          onSelectDifficulty={selectDifficulty}
        />

        <GameStartOverlay
          open={state.phase === 'gameStart'}
          onStart={start}
        />

        <ResultOverlay
          open={state.phase === 'youWin'}
          variant="youWin"
          onRetry={retry}
        />

        <ResultOverlay
          open={state.phase === 'youLose'}
          variant="youLose"
          onRetry={retry}
        />

        {isResultPhase(state.phase) ? (
          <div aria-live="polite" className="sr-only">
            {state.phase === 'youWin' ? 'YOU WIN' : 'YOU LOSE'}
          </div>
        ) : null}
      </div>
    </main>
  );
}
