'use client';

import { GameBoard } from '@/components/game/GameBoard';
import { GameStage } from '@/components/game/GameStage';
import { GameStartOverlay } from '@/components/game/GameStartOverlay';
import { MenuScreen } from '@/components/game/MenuScreen';
import { PlayerArea } from '@/components/game/PlayerArea';
import { ResultOverlay } from '@/components/game/ResultOverlay';
import { GAME_SCREEN_CLASS, GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';
import { useGameScreen } from '@/hooks';

export function GameScreen() {
  const {
    phase,
    boardProps,
    cpuPlayerAreaProps,
    humanPlayerAreaProps,
    menuProps,
    gameStartProps,
    youWinProps,
    youLoseProps,
  } = useGameScreen();

  return (
    <main className={GAME_SCREEN_CLASS}>
      <div
        className="relative shrink-0"
        style={{
          width: gameSize(GAME_LAYOUT.frameWidth),
          height: gameSize(GAME_LAYOUT.frameHeight),
        }}
      >
        <div inert={phase.isOverlayPhase ? true : undefined}>
          <GameStage />

          <div className="relative flex h-full flex-col">
            <PlayerArea
              {...cpuPlayerAreaProps}
              className="relative z-[1] shrink-0"
            />

            <section
              className="relative z-10 flex shrink-0 items-center justify-center"
              style={{ marginBlock: gameSize(-GAME_LAYOUT.board.overlapY) }}
              aria-label="対局エリア"
            >
              <GameBoard {...boardProps} />
            </section>

            <PlayerArea
              {...humanPlayerAreaProps}
              className="relative z-[1] shrink-0"
            />
          </div>
        </div>

        <MenuScreen {...menuProps} />

        <GameStartOverlay {...gameStartProps} />

        <ResultOverlay {...youWinProps} />

        <ResultOverlay {...youLoseProps} />

        {phase.resultAnnouncement ? (
          <div aria-live="polite" className="sr-only">
            {phase.resultAnnouncement}
          </div>
        ) : null}
      </div>
    </main>
  );
}
