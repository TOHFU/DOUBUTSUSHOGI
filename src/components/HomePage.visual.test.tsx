import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { GameScreen } from '@/components/game/GameScreen';

test('MENU画面の見た目', async () => {
  const view = await render(<GameScreen />);
  const screen = view.getByRole('main');

  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 450));

  await expect.element(screen.getByRole('button', { name: 'かんたん' })).toBeVisible();

  await expect.element(screen).toMatchScreenshot('menu-screen');
});
