import { expect, test } from '@playwright/test';

test('トップページにメニュー画面が表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'かんたん' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'むずかしい' })).toBeVisible();
});

test('難易度選択後にゲーム開始画面が表示される', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'かんたん' }).click();

  await expect(
    page.getByRole('button', { name: 'ゲームを開始' }),
  ).toBeVisible();
});

test('ゲーム開始後に将棋盤が表示される', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'かんたん' }).click();
  await page.getByRole('button', { name: 'ゲームを開始' }).click();

  await expect(page.getByRole('grid', { name: '将棋盤' })).toBeVisible();
});
