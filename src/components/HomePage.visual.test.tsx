import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { HomePage } from './HomePage';

test('HomePageの見た目', async () => {
  const view = await render(<HomePage />);

  await expect
    .element(view.getByRole('heading', { name: 'DOUBUTSUSHOGI' }))
    .toBeVisible();
});
