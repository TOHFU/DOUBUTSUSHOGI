/** 盤面の行数 */
export const BOARD_ROWS = 4;

/** 盤面の列数 */
export const BOARD_COLS = 3;

/** 駒の種類一覧 */
export const PIECE_KINDS = [
  'lion',
  'giraffe',
  'elephant',
  'chick',
  'chicken',
] as const;

/** 駒の種類 */
export type PieceKind = (typeof PIECE_KINDS)[number];

/** 対局プレイヤー（blue=CPU、green=人間） */
export type Player = 'blue' | 'green';

/** 盤面上の座標 */
export interface Position {
  row: number;
  col: number;
}

/** 盤面上の駒 */
export interface Piece {
  kind: PieceKind;
  owner: Player;
}

/** 盤面の1マス（駒または空） */
export type Cell = Piece | null;

/** 3×4 の盤面 */
export type Board = Cell[][];

/**
 * ゲームの進行フェーズ。
 * - menu: メニュー表示
 * - gameStart: ゲーム開始確認
 * - playing: 対局中
 * - pieceSelect: 盤上の駒選択中
 * - havePieceSelect: 持ち駒の打ち込み選択中
 * - youWin / youLose: 勝敗確定
 */
export type GamePhase =
  | 'menu'
  | 'gameStart'
  | 'playing'
  | 'pieceSelect'
  | 'havePieceSelect'
  | 'youWin'
  | 'youLose';

/** CPU 難易度 */
export type Difficulty = 'easy' | 'hard';

/** ゲーム全体の状態 */
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

/**
 * 1手の移動。
 * from が null の場合は持ち駒の打ち込みを表す。
 */
export interface Move {
  from: Position | null;
  to: Position;
  piece: PieceKind;
  captured?: PieceKind;
  promoted?: boolean;
}
