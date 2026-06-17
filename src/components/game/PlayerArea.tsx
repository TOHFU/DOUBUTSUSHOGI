import { GameImage } from '@/components/game/GameImage';
import { GamePiece } from '@/components/game/GamePiece';
import { UI_ASSETS } from '@/components/game/assets';
import { getPieceLabel, getPlayerLabel } from '@/components/game/pieceLabels';
import { GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';
import type { PieceKind, Player } from '@/domain/game/types';

interface PlayerAreaProps {
  player: Player;
  capturedPieces: PieceKind[];
  isActive: boolean;
  placingPiece?: PieceKind | null;
  onSelectCaptured?: (piece: PieceKind) => void;
  className?: string;
}

export function PlayerArea({
  player,
  capturedPieces,
  isActive,
  placingPiece = null,
  onSelectCaptured,
  className,
}: PlayerAreaProps) {
  const isBlue = player === 'blue';
  const layout = GAME_LAYOUT.playerArea;
  const capturedLayout = layout.captured;
  const teamLabel = getPlayerLabel(player);

  return (
    <div
      className={`relative w-full mix-blend-darken ${className ?? ''}`}
      style={{ height: gameSize(GAME_LAYOUT.playerAreaHeight) }}
      aria-label={`${teamLabel}チーム`}
    >
      <GameImage
        src={isBlue ? UI_ASSETS.backgroundBlue : UI_ASSETS.backgroundGreen}
        alt=""
        aria-hidden
        width={GAME_LAYOUT.frameWidth}
        height={isBlue ? layout.blueBackgroundHeight : layout.greenBackgroundHeight}
        className="absolute inset-x-0 w-full object-cover"
        style={
          isBlue
            ? {
                top: gameSize(layout.blueBackgroundTop),
                height: gameSize(layout.blueBackgroundHeight),
              }
            : { bottom: 0, height: gameSize(layout.greenBackgroundHeight) }
        }
      />
      <GameImage
        src={isBlue ? UI_ASSETS.teamBlue : UI_ASSETS.teamGreen}
        alt=""
        aria-hidden
        width={isBlue ? layout.teamBlue.width : layout.teamGreen.width}
        height={isBlue ? layout.teamBlue.height : layout.teamGreen.height}
        className="absolute z-10 mix-blend-multiply"
        style={
          isBlue
            ? {
                left: gameSize(layout.teamBlue.left),
                top: gameSize(layout.teamBlue.top),
                width: gameSize(layout.teamBlue.width),
                height: gameSize(layout.teamBlue.height),
              }
            : {
                left: gameSize(layout.teamGreen.left),
                bottom: gameSize(layout.teamGreen.bottom),
                width: gameSize(layout.teamGreen.width),
                height: gameSize(layout.teamGreen.height),
              }
        }
      />
      <div
        role="list"
        aria-label={`${teamLabel}の持ち駒`}
        className="absolute z-20 flex mix-blend-normal items-center"
        style={{
          width: gameSize(capturedLayout.width),
          height: gameSize(capturedLayout.height),
          left: gameSize(capturedLayout.left),
          ...(isBlue
            ? { top: gameSize(capturedLayout.blueTop) }
            : { bottom: gameSize(capturedLayout.greenBottom) }),
        }}
      >
        {capturedPieces.map((piece, index) => (
          <button
            key={`${piece}-${index}`}
            type="button"
            role="listitem"
            aria-label={`持ち駒 ${getPieceLabel(piece)}`}
            aria-selected={placingPiece === piece || undefined}
            disabled={!isActive || !onSelectCaptured}
            onClick={() => onSelectCaptured?.(piece)}
            className="shrink-0 disabled:cursor-default"
            style={{
              width: gameSize(capturedLayout.piece),
              height: gameSize(capturedLayout.piece),
              marginLeft: index === 0 ? 0 : gameSize(-capturedLayout.overlap),
            }}
          >
            <GamePiece
              kind={piece}
              owner={player}
              className="size-full"
              variant="captured"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
