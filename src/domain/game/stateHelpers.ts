import { createInitialBoard, getOpponent } from '@/domain/game/board';
import { findLion } from '@/domain/game/moves';
import { HUMAN_PLAYER } from '@/domain/game/constants';
import type {
  GamePhase,
  GameState,
  PieceKind,
  Player,
} from '@/domain/game/types';

export function isTerminalPhase(phase: GamePhase): boolean {
  return phase === 'gameStart' || phase === 'youWin' || phase === 'youLose';
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: HUMAN_PLAYER,
    phase: 'gameStart',
    selectedPosition: null,
    highlightedPositions: [],
    captured: { blue: [], green: [] },
    placingPiece: null,
    winner: null,
  };
}

export function toPlayingState(state: GameState): GameState {
  return {
    ...state,
    phase: 'playing',
    selectedPosition: null,
    highlightedPositions: [],
    placingPiece: null,
  };
}

export function toResultPhase(winner: Player): GamePhase {
  return winner === HUMAN_PLAYER ? 'youWin' : 'youLose';
}

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

export function startGame(state: GameState): GameState {
  return toPlayingState({
    ...createInitialGameState(),
    captured: state.captured,
  });
}

export function retryGame(): GameState {
  return createInitialGameState();
}

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

export function switchTurn(state: GameState): Player {
  return getOpponent(state.currentPlayer);
}
