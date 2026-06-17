import Image from 'next/image';

import { GamePiece } from '@/components/game/GamePiece';
import { UI_ASSETS } from '@/components/game/assets';
import { GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';
import type { Cell, Position } from '@/domain/game/types';
import { isPositionInList } from '@/domain/game/moves';

interface BoardSquareProps {
  piece: Cell;
  position: Position;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (position: Position) => void;
}

function BoardSquare({
  piece,
  position,
  isSelected,
  isHighlighted,
  onSelect,
}: BoardSquareProps) {
  const showSelect = isSelected || isHighlighted;
  const cellSize = gameSize(GAME_LAYOUT.board.cell);

  return (
    <button
      type="button"
      aria-label={`マス ${position.row + 1}-${position.col + 1}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(position)}
      className="relative shrink-0 border-0 bg-transparent p-0"
      style={{ width: cellSize, height: cellSize }}
    >
      {piece ? (
        <GamePiece
          kind={piece.kind}
          owner={piece.owner}
          className={`relative z-10 size-full ${isSelected ? 'scale-[0.98]' : ''}`}
        />
      ) : null}
      {showSelect ? (
        <Image
          src={UI_ASSETS.select}
          alt=""
          aria-hidden
          width={100}
          height={100}
          unoptimized
          className="pointer-events-none absolute inset-0 z-20 size-full"
        />
      ) : null}
    </button>
  );
}

interface GameBoardProps {
  board: Cell[][];
  selectedPosition: Position | null;
  highlightedPositions: Position[];
  onSelectSquare: (position: Position) => void;
}

export function GameBoard({
  board,
  selectedPosition,
  highlightedPositions,
  onSelectSquare,
}: GameBoardProps) {
  const { board: boardLayout } = GAME_LAYOUT;

  return (
    <div
      className="relative mx-auto"
      style={{
        width: gameSize(boardLayout.width),
        height: gameSize(boardLayout.height),
      }}
    >
      <div
        className="relative grid grid-cols-3 grid-rows-4"
        role="grid"
        aria-label="将棋盤"
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex };

            return (
              <BoardSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={position}
                isSelected={
                  selectedPosition?.row === rowIndex &&
                  selectedPosition.col === colIndex
                }
                isHighlighted={isPositionInList(
                  position,
                  highlightedPositions,
                )}
                onSelect={onSelectSquare}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
