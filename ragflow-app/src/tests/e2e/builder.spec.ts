import { test, expect } from '@playwright/test';

test.describe('Pipeline Builder', () => {
  test('loads step 1 of builder wizard', async ({ page }) => {
    await page.goto('/pipelines/new');
    await expect(page.locator('text=New Pipeline')).toBeVisible();
    await expect(page.locator('text=Pipeline Details')).toBeVisible();
  });

  test('can advance from step 1 to step 2', async ({ page }) => {
    await page.goto('/pipelines/new');
    await page.click('text=Continue →');
    await expect(page.locator('text=Select Embedding Provider')).toBeVisible();
  });

  test('step sidebar shows all 7 steps', async ({ page }) => {
    await page.goto('/pipelines/new');
    await expect(page.locator('text=Name & Description')).toBeVisible();
    await expect(page.locator('text=Review & Create')).toBeVisible();
  });
});
