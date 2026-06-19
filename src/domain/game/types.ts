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
  /** 行番号（0 が上段） */
  row: number;
  /** 列番号（0 が左端） */
  col: number;
}

/** 盤面上の駒 */
export interface Piece {
  /** 駒の種類 */
  kind: PieceKind;
  /** 駒の所有者 */
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
  /** 現在の盤面 */
  board: Board;
  /** 手番のプレイヤー */
  currentPlayer: Player;
  /** 現在のフェーズ */
  phase: GamePhase;
  /** 選択中の難易度（未選択時は null） */
  difficulty: Difficulty | null;
  /** 選択中の盤上の駒の座標 */
  selectedPosition: Position | null;
  /** ハイライト表示中の移動可能マス */
  highlightedPositions: Position[];
  /** 各プレイヤーの持ち駒 */
  captured: Record<Player, PieceKind[]>;
  /** 打ち込み選択中の持ち駒 */
  placingPiece: PieceKind | null;
  /** 勝者（未決定時は null） */
  winner: Player | null;
}

/**
 * 1手の移動。
 * from が null の場合は持ち駒の打ち込みを表す。
 */
export interface Move {
  /** 移動元。持ち駒打ちの場合は null */
  from: Position | null;
  /** 移動先 */
  to: Position;
  /** 動かす駒の種類 */
  piece: PieceKind;
  /** 取った駒の種類 */
  captured?: PieceKind;
  /** 成ったかどうか */
  promoted?: boolean;
}
