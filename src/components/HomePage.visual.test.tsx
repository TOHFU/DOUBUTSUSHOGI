import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { GameScreen } from './GameScreen';

test('GameScreenの見た目', async () => {
  const view = await render(<GameScreen />);

  await expect
    .element(view.getByRole('button', { name: 'ゲームを開始' }))
    .toBeVisible();
});
