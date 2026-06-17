'use client';

import Image from 'next/image';
import { useEffect, useReducer } from 'react';

import { GameBoard } from '@/components/game/GameBoard';
import { GameStartOverlay } from '@/components/game/GameStartOverlay';
import { PlayerArea } from '@/components/game/PlayerArea';
import { ResultOverlay } from '@/components/game/ResultOverlay';
import { UI_ASSETS } from '@/components/game/assets';
import { GAME_SCREEN_CLASS, GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';
import {
  CPU_PLAYER,
  HUMAN_PLAYER,
  createInitialGameState,
  pickCpuMove,
  retryGame,
  selectBoardSquare,
  selectCapturedPiece,
  startGame,
} from '@/domain/game/game';
import type { GameState, PieceKind, Position } from '@/domain/game/types';

type GameAction =
  | { type: 'start' }
  | { type: 'retry' }
  | { type: 'selectSquare'; position: Position }
  | { type: 'selectCaptured'; piece: PieceKind }
  | { type: 'cpuMove' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start':
      return startGame(state);
    case 'retry':
      return retryGame();
    case 'selectSquare':
      return selectBoardSquare(state, action.position);
    case 'selectCaptured':
      return selectCapturedPiece(state, action.piece);
    case 'cpuMove':
      return pickCpuMove(state);
    default:
      return state;
  }
}

export function GameScreen() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState,
  );

  useEffect(() => {
    if (state.currentPlayer !== CPU_PLAYER) {
      return;
    }

    if (
      state.phase === 'gameStart' ||
      state.phase === 'youWin' ||
      state.phase === 'youLose'
    ) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'cpuMove' });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [state.currentPlayer, state.phase, state.board, state.captured]);

  const handleSelectSquare = (position: Position) => {
    if (state.currentPlayer !== HUMAN_PLAYER) {
      return;
    }

    dispatch({ type: 'selectSquare', position });
  };

  const handleSelectCaptured = (piece: PieceKind) => {
    if (state.currentPlayer !== HUMAN_PLAYER) {
      return;
    }

    dispatch({ type: 'selectCaptured', piece });
  };

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
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
          style={{
            top: gameSize(GAME_LAYOUT.stage.top),
            width: gameSize(GAME_LAYOUT.stage.width),
            height: gameSize(GAME_LAYOUT.stage.height),
          }}
        >
          <Image
            src={UI_ASSETS.stage}
            alt=""
            width={GAME_LAYOUT.stage.width}
            height={GAME_LAYOUT.stage.height}
            unoptimized
            className="size-full max-w-none"
            priority
          />
        </div>

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
          >
            <GameBoard
              board={state.board}
              selectedPosition={state.selectedPosition}
              highlightedPositions={state.highlightedPositions}
              onSelectSquare={handleSelectSquare}
            />
          </section>

          <PlayerArea
            player="green"
            capturedPieces={state.captured.green}
            placingPiece={
              state.currentPlayer === HUMAN_PLAYER ? state.placingPiece : null
            }
            isActive={
              state.currentPlayer === HUMAN_PLAYER &&
              state.phase !== 'gameStart' &&
              state.phase !== 'youWin' &&
              state.phase !== 'youLose'
            }
            onSelectCaptured={handleSelectCaptured}
            className="relative z-[1] shrink-0"
          />
        </div>

        {state.phase === 'gameStart' ? (
          <GameStartOverlay onStart={() => dispatch({ type: 'start' })} />
        ) : null}

        {state.phase === 'youWin' ? (
          <ResultOverlay variant="youWin" onRetry={() => dispatch({ type: 'retry' })} />
        ) : null}

        {state.phase === 'youLose' ? (
          <ResultOverlay variant="youLose" onRetry={() => dispatch({ type: 'retry' })} />
        ) : null}
      </div>
    </main>
  );
}
