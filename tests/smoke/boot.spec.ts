import { expect, test } from '@playwright/test';

test('app boots and renders a canvas', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#game canvas');
  await expect(canvas).toBeVisible({ timeout: 10_000 });

  const size = await canvas.boundingBox();
  expect(size?.width).toBeGreaterThan(0);
  expect(size?.height).toBeGreaterThan(0);
});

test('game loop keeps the canvas after boot', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  await page.goto('/');
  const canvas = page.locator('#game canvas');
  await expect(canvas).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(500);
  await expect(canvas).toBeVisible();
  expect(errors).toEqual([]);
});
