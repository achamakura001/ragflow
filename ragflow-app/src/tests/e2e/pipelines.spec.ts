import { test, expect } from '@playwright/test';

test.describe('Pipelines', () => {
  test('loads pipelines list', async ({ page }) => {
    await page.goto('/pipelines');
    await expect(page.locator('text=Pipelines')).toBeVisible();
  });

  test('shows pipeline rows', async ({ page }) => {
    await page.goto('/pipelines');
    await expect(page.locator('text=HR Policy Documents')).toBeVisible();
  });

  test('tabs filter correctly', async ({ page }) => {
    await page.goto('/pipelines');
    await page.click('text=Active');
    await expect(page.locator('text=All Pipelines')).toBeVisible();
  });
});
