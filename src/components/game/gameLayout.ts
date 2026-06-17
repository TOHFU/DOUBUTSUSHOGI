/** Figma GAME フレーム (390×844) の Auto Layout 寸法 */
export const GAME_LAYOUT = {
  frameWidth: 390,
  frameHeight: 844,
  playerAreaHeight: 230,
  board: {
    width: 300,
    height: 400,
    cell: 100,
    overlapY: 8,
  },
  stage: {
    width: 361,
    height: 464,
    top: 181,
  },
  playerArea: {
    blueBackgroundTop: 41,
    blueBackgroundHeight: 213,
    greenBackgroundHeight: 180,
    teamBlue: { left: 19, top: 95, width: 134, height: 132 },
    teamGreen: { left: 58, bottom: 95, width: 139, height: 126 },
    captured: {
      width: 300,
      height: 200,
      piece: 200,
      overlap: 100,
      left: 45,
      blueTop: 0,
      greenBottom: 20,
    },
  },
  overlays: {
    gameStart: { width: 327, height: 290 },
  },
} as const;

/** 390px 基準の寸法を `--game-unit` に対してスケール */
export function gameSize(value: number): string {
  return `calc(var(--game-unit) * ${value} / ${GAME_LAYOUT.frameWidth})`;
}

/** 幅・高さの両方を考慮し、390×844 のアスペクト比を保ってスケール */
export const GAME_SCREEN_CLASS =
  'game-screen flex min-h-dvh w-full items-center justify-center overflow-hidden bg-white [--game-frame-width:390px] [--game-unit:min(100vw,calc(100dvh*390/844),var(--game-frame-width))]';
