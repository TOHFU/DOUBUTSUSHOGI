export const BOARD_ROWS = 4;
export const BOARD_COLS = 3;

export const PIECE_KINDS = [
  'lion',
  'giraffe',
  'elephant',
  'chick',
  'chicken',
] as const;

export type PieceKind = (typeof PIECE_KINDS)[number];
export type Player = 'blue' | 'green';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  kind: PieceKind;
  owner: Player;
}

export type Cell = Piece | null;

export type Board = Cell[][];

export type GamePhase =
  | 'menu'
  | 'gameStart'
  | 'playing'
  | 'pieceSelect'
  | 'havePieceSelect'
  | 'youWin'
  | 'youLose';

export type Difficulty = 'easy' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  phase: GamePhase;
  difficulty: Difficulty | null;
  selectedPosition: Position | null;
  highlightedPositions: Position[];
  captured: Record<Player, PieceKind[]>;
  placingPiece: PieceKind | null;
  winner: Player | null;
}

export interface Move {
  from: Position | null;
  to: Position;
  piece: PieceKind;
  captured?: PieceKind;
  promoted?: boolean;
}
