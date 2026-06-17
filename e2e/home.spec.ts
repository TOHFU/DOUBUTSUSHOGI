import { expect, test } from '@playwright/test';

test('トップページにゲーム開始画面が表示される', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('button', { name: 'ゲームを開始' }),
  ).toBeVisible();
});

test('ゲーム開始後に将棋盤が表示される', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'ゲームを開始' }).click();

  await expect(page.getByRole('grid', { name: '将棋盤' })).toBeVisible();
});
