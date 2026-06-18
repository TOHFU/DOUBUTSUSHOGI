import { GameDialog } from '@/components/game/GameDialog';
import { GameImage } from '@/components/game/GameImage';
import { UI_ASSETS } from '@/components/game/assets';
import { GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';

interface GameStartOverlayProps {
  open: boolean;
  onStart: () => void;
}

export function GameStartOverlay({ open, onStart }: GameStartOverlayProps) {
  const { gameStart } = GAME_LAYOUT.overlays;

  return (
    <GameDialog open={open} variant="gameStart" aria-label="ゲームを開始">
      <button
        type="button"
        data-testid="game-start-button"
        aria-label="ゲームを開始"
        onClick={onStart}
        className="flex size-full items-center justify-center border-0 bg-transparent p-0"
      >
        <GameImage
          src={UI_ASSETS.gameStartOverlay}
          alt=""
          aria-hidden
          width={gameStart.width}
          height={gameStart.height}
          className="pointer-events-none h-auto max-w-[90vw]"
          style={{ width: gameSize(gameStart.width) }}
          priority
        />
      </button>
    </GameDialog>
  );
}
