import { GameImage } from '@/components/game/GameImage';
import { UI_ASSETS } from '@/components/game/assets';
import { gameSize } from '@/components/game/gameLayout';
import { RESULT_OVERLAY_LAYOUT } from '@/components/game/resultOverlayLayout';

interface ResultOverlayProps {
  variant: 'youWin' | 'youLose';
  onRetry: () => void;
}

export function ResultOverlay({ variant, onRetry }: ResultOverlayProps) {
  const messageAsset =
    variant === 'youWin'
      ? UI_ASSETS.youWinMessage
      : UI_ASSETS.youLoseMessage;
  const messageAlt = variant === 'youWin' ? 'YOU WIN' : 'YOU LOSE';
  const { message, retry } = RESULT_OVERLAY_LAYOUT;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={messageAlt}
    >
      <div
        className="relative max-w-[90vw]"
        style={{
          width: gameSize(message.width),
        }}
      >
        <GameImage
          src={messageAsset}
          alt={messageAlt}
          width={message.width}
          height={message.height}
          className="pointer-events-none block h-auto w-full"
          priority
        />
        <button
          type="button"
          aria-label="リトライ"
          onClick={onRetry}
          className="absolute left-1/2 -translate-x-1/2 transition hover:opacity-80 active:scale-95"
          style={{
            top: gameSize(retry.top),
            width: gameSize(retry.width),
            height: gameSize(retry.height),
          }}
        >
          <GameImage
            src={UI_ASSETS.retryButton}
            alt="RETRY"
            width={retry.width}
            height={retry.height}
            className="h-full w-full"
          />
        </button>
      </div>
    </div>
  );
}
