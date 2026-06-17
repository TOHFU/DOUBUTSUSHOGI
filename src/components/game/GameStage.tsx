import { GameImage } from '@/components/game/GameImage';
import { UI_ASSETS } from '@/components/game/assets';
import { GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';

export function GameStage() {
  const { stage } = GAME_LAYOUT;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
      style={{
        top: gameSize(stage.top),
        width: gameSize(stage.width),
        height: gameSize(stage.height),
      }}
    >
      <GameImage
        src={UI_ASSETS.stage}
        alt=""
        width={stage.width}
        height={stage.height}
        className="size-full max-w-none"
        priority
      />
    </div>
  );
}
