'use client';

import { GameBoard } from '@/components/game/GameBoard';
import { GameStage } from '@/components/game/GameStage';
import { GameStartOverlay } from '@/components/game/GameStartOverlay';
import { PlayerArea } from '@/components/game/PlayerArea';
import { ResultOverlay } from '@/components/game/ResultOverlay';
import { GAME_SCREEN_CLASS, GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';
import { isHumanCapturingActive, isResultPhase } from '@/components/game/gamePhase';
import { useGameController } from '@/components/game/useGameController';
import { HUMAN_PLAYER } from '@/domain/game/constants';

export function GameScreen() {
  const { state, start, retry, selectSquare, selectCaptured } =
    useGameController();

  return (
    <main className={GAME_SCREEN_CLASS}>
      <div
        className="relative shrink-0"
        style={{
          width: gameSize(GAME_LAYOUT.frameWidth),
          height: gameSize(GAME_LAYOUT.frameHeight),
        }}
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

        {state.phase === 'gameStart' ? (
          <GameStartOverlay onStart={start} />
        ) : null}

        {state.phase === 'youWin' ? (
          <ResultOverlay variant="youWin" onRetry={retry} />
        ) : null}

        {state.phase === 'youLose' ? (
          <ResultOverlay variant="youLose" onRetry={retry} />
        ) : null}

        {isResultPhase(state.phase) ? (
          <div aria-live="polite" className="sr-only">
            {state.phase === 'youWin' ? 'YOU WIN' : 'YOU LOSE'}
          </div>
        ) : null}
      </div>
    </main>
  );
}
