import { createInitialBoard, getOpponent, positionsEqual } from '@/domain/game/board';
import {
  applyMove,
  findLion,
  getDropMoves,
  getMovesForPiece,
  isPositionInList,
} from '@/domain/game/moves';
import {
  BOARD_COLS,
  BOARD_ROWS,
  type GamePhase,
  type GameState,
  type Move,
  type PieceKind,
  type Player,
  type Position,
} from '@/domain/game/types';

export const HUMAN_PLAYER: Player = 'green';
export const CPU_PLAYER: Player = 'blue';

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

function toPlayingState(state: GameState): GameState {
  return {
    ...state,
    phase: 'playing',
    selectedPosition: null,
    highlightedPositions: [],
    placingPiece: null,
  };
}

function toResultPhase(winner: Player): GamePhase {
  return winner === HUMAN_PLAYER ? 'youWin' : 'youLose';
}

function handleCapture(
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

function resolveWinner(board: GameState['board']): Player | null {
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

function executeMove(state: GameState, move: Move): GameState {
  const target = state.board[move.to.row]?.[move.to.col] ?? null;
  const capturedKind = target?.kind;
  const nextBoard = applyMove(state.board, move, state.currentPlayer);
  const winner = resolveWinner(nextBoard);
  const nextPlayer = getOpponent(state.currentPlayer);

  if (winner) {
    return {
      ...state,
      board: nextBoard,
      captured: capturedKind
        ? handleCapture(state, capturedKind, state.currentPlayer)
        : state.captured,
      currentPlayer: nextPlayer,
      phase: toResultPhase(winner),
      selectedPosition: null,
      highlightedPositions: [],
      placingPiece: null,
      winner,
    };
  }

  return {
    ...toPlayingState({
      ...state,
      board: nextBoard,
      captured: capturedKind
        ? handleCapture(state, capturedKind, state.currentPlayer)
        : state.captured,
      currentPlayer: nextPlayer,
      winner: null,
    }),
  };
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

export function selectBoardSquare(
  state: GameState,
  position: Position,
): GameState {
  if (state.phase === 'gameStart' || state.phase === 'youWin' || state.phase === 'youLose') {
    return state;
  }

  if (state.phase === 'havePieceSelect' && state.placingPiece) {
    if (isPositionInList(position, state.highlightedPositions)) {
      return applyMoveWithCapture(state, {
        from: null,
        to: position,
        piece: state.placingPiece,
      });
    }

    const piece = state.board[position.row]?.[position.col];

    if (piece && piece.owner === state.currentPlayer) {
      return {
        ...state,
        phase: 'pieceSelect',
        selectedPosition: position,
        highlightedPositions: getMovesForPiece(state.board, position),
        placingPiece: null,
      };
    }

    return toPlayingState(state);
  }

  if (state.phase === 'pieceSelect' && state.selectedPosition) {
    if (positionsEqual(position, state.selectedPosition)) {
      return toPlayingState(state);
    }

    if (isPositionInList(position, state.highlightedPositions)) {
      const piece = state.board[state.selectedPosition.row]?.[
        state.selectedPosition.col
      ];

      if (!piece) {
        return toPlayingState(state);
      }

      return executeMove(state, {
        from: state.selectedPosition,
        to: position,
        piece: piece.kind,
      });
    }
  }

  const piece = state.board[position.row]?.[position.col];

  if (!piece || piece.owner !== state.currentPlayer) {
    return toPlayingState(state);
  }

  const highlightedPositions = getMovesForPiece(state.board, position);

  return {
    ...state,
    phase: 'pieceSelect',
    selectedPosition: position,
    highlightedPositions,
    placingPiece: null,
  };
}

export function selectCapturedPiece(
  state: GameState,
  piece: PieceKind,
): GameState {
  if (state.phase !== 'playing' && state.phase !== 'pieceSelect' && state.phase !== 'havePieceSelect') {
    return state;
  }

  const available = state.captured[state.currentPlayer];

  if (!available.includes(piece)) {
    return toPlayingState(state);
  }

  if (state.phase === 'havePieceSelect' && state.placingPiece === piece) {
    return toPlayingState(state);
  }

  return {
    ...state,
    phase: 'havePieceSelect',
    selectedPosition: null,
    placingPiece: piece,
    highlightedPositions: getDropMoves(state.board),
  };
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

export function applyMoveWithCapture(state: GameState, move: Move): GameState {
  const mover = state.currentPlayer;
  const nextState = executeMove(state, move);

  if (move.from === null) {
    return consumeCapturedPiece(nextState, move.piece, mover);
  }

  return nextState;
}

export function pickCpuMove(state: GameState): GameState {
  if (state.currentPlayer !== CPU_PLAYER) {
    return state;
  }

  const dropMoves = state.captured.blue.flatMap((piece) =>
    getDropMoves(state.board).map((to) => ({
      from: null as Position | null,
      to,
      piece,
    })),
  );

  const boardMoves = [] as Move[];

  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const from = { row, col };
      const piece = state.board[row]?.[col];

      if (piece?.owner !== CPU_PLAYER) {
        continue;
      }

      for (const to of getMovesForPiece(state.board, from)) {
        boardMoves.push({ from, to, piece: piece.kind });
      }
    }
  }

  const candidates = [...boardMoves, ...dropMoves];

  if (candidates.length === 0) {
    return {
      ...state,
      phase: toResultPhase(HUMAN_PLAYER),
      winner: HUMAN_PLAYER,
    };
  }

  const lionCapture = candidates.find((move) => {
    const target = state.board[move.to.row]?.[move.to.col];
    return target?.kind === 'lion' && target.owner === HUMAN_PLAYER;
  });

  const move = lionCapture ?? candidates[Math.floor(Math.random() * candidates.length)];

  if (move.from === null) {
    return applyMoveWithCapture(
      {
        ...state,
        phase: 'havePieceSelect',
        placingPiece: move.piece,
        highlightedPositions: getDropMoves(state.board),
      },
      move,
    );
  }

  return executeMove(
    {
      ...state,
      phase: 'pieceSelect',
      selectedPosition: move.from,
      highlightedPositions: getMovesForPiece(state.board, move.from),
    },
    move,
  );
}
