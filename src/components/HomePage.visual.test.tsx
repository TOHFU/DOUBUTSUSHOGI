import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { GameScreen } from '@/components/game/GameScreen';

test('GameScreenの見た目', async () => {
  const view = await render(<GameScreen />);

  await expect
    .element(view.getByRole('button', { name: 'かんたん' }))
    .toBeVisible();
});
