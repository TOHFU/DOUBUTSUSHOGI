'use client';

import { GameDialog } from '@/components/game/GameDialog';
import { GameImage } from '@/components/game/GameImage';
import { UI_ASSETS } from '@/components/game/assets';
import { MENU_LAYOUT } from '@/components/game/menuLayout';
import { GAME_LAYOUT, gameSize } from '@/components/game/gameLayout';
import type { Difficulty } from '@/domain/game/types';

interface MenuScreenProps {
  open: boolean;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export function MenuScreen({ open, onSelectDifficulty }: MenuScreenProps) {
  const { header, difficultyLabel, easyButton, hardButton } = MENU_LAYOUT;

  return (
    <GameDialog open={open} variant="menu" aria-label="メニュー">
      <div
        className="relative shrink-0"
        style={{
          width: gameSize(GAME_LAYOUT.frameWidth),
          height: gameSize(GAME_LAYOUT.frameHeight),
        }}
      >
      <GameImage
        src={UI_ASSETS.menuHeader}
        alt=""
        aria-hidden
        width={header.width}
        height={header.height}
        className="absolute"
        style={{
          top: gameSize(header.top),
          left: gameSize(header.left),
          width: gameSize(header.width),
          height: gameSize(header.height),
        }}
        priority
      />

      <GameImage
        src={UI_ASSETS.menuDifficultyLabel}
        alt=""
        aria-hidden
        width={difficultyLabel.width}
        height={difficultyLabel.height}
        className="absolute"
        style={{
          top: gameSize(difficultyLabel.top),
          left: gameSize(difficultyLabel.left),
          width: gameSize(difficultyLabel.width),
          height: gameSize(difficultyLabel.height),
        }}
      />

      <button
        type="button"
        data-testid="menu-easy-button"
        aria-label="かんたん"
        onClick={() => onSelectDifficulty('easy')}
        className="absolute"
        style={{
          top: gameSize(easyButton.top),
          left: gameSize(easyButton.left),
          width: gameSize(easyButton.width),
          height: gameSize(easyButton.height),
        }}
      >
        <GameImage
          src={UI_ASSETS.menuEasyButton}
          alt=""
          aria-hidden
          width={easyButton.width}
          height={easyButton.height}
          className="pointer-events-none h-full w-full"
        />
      </button>

      <button
        type="button"
        data-testid="menu-hard-button"
        aria-label="むずかしい"
        onClick={() => onSelectDifficulty('hard')}
        className="absolute"
        style={{
          top: gameSize(hardButton.top),
          left: gameSize(hardButton.left),
          width: gameSize(hardButton.width),
          height: gameSize(hardButton.height),
        }}
      >
        <GameImage
          src={UI_ASSETS.menuHardButton}
          alt=""
          aria-hidden
          width={hardButton.width}
          height={hardButton.height}
          className="pointer-events-none h-full w-full"
        />
      </button>
      </div>
    </GameDialog>
  );
}
