'use client';

import { GameImage } from '@/components/game/GameImage';
import { UI_ASSETS } from '@/components/game/assets';
import { MENU_LAYOUT } from '@/components/game/menuLayout';
import { gameSize } from '@/components/game/gameLayout';
import type { Difficulty } from '@/domain/game/types';

interface MenuScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export function MenuScreen({ onSelectDifficulty }: MenuScreenProps) {
  const { header, difficultyLabel, easyButton, hardButton } = MENU_LAYOUT;

  return (
    <div
      className="absolute inset-0 z-30 bg-white"
      role="dialog"
      aria-label="メニュー"
    >
      <GameImage
        src={UI_ASSETS.menuHeader}
        alt=""
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
        alt="難易度"
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
          alt="かんたん"
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
          alt="むずかしい"
          width={hardButton.width}
          height={hardButton.height}
          className="pointer-events-none h-full w-full"
        />
      </button>
    </div>
  );
}
