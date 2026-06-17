import { expect, test } from '@playwright/test';

test('トップページにタイトルが表示される', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'DOUBUTSUSHOGI' }),
  ).toBeVisible();
  await expect(
    page.getByText('動物将棋のオンライン対戦プラットフォーム'),
  ).toBeVisible();
});
