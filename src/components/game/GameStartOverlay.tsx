import Image from 'next/image';

import { UI_ASSETS } from '@/components/game/assets';
import { GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';

interface GameStartOverlayProps {
  onStart: () => void;
}

export function GameStartOverlay({ onStart }: GameStartOverlayProps) {
  const { gameStart } = GAME_LAYOUT.overlays;

  return (
    <button
      type="button"
      data-testid="game-start-button"
      aria-label="ゲームを開始"
      onClick={onStart}
      className="absolute inset-0 z-30 flex items-center justify-center bg-white/20"
    >
      <Image
        src={UI_ASSETS.gameStartOverlay}
        alt="GAME START"
        width={gameStart.width}
        height={gameStart.height}
        unoptimized
        className="pointer-events-none h-auto max-w-[90vw]"
        style={{ width: gameSize(gameStart.width) }}
        priority
      />
    </button>
  );
}
