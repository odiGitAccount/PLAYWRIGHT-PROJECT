import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {

  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test('has correct heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Example Domain');
  });

  test('has more information link', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: 'More information...' });
    await expect(link).toBeVisible();
  });

});
