import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('loads and shows Dashboard title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('shows 4 stat cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="stat-card"]')).toHaveCount(4);
  });

  test('New Pipeline button navigates to builder', async ({ page }) => {
    await page.goto('/');
    await page.click('text=New Pipeline');
    await expect(page).toHaveURL('/pipelines/new');
  });
});
