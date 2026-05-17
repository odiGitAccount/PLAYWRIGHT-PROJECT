import { test, expect, Page } from '@playwright/test';

const URL = 'https://rahulshettyacademy.com/loginpagePractise/';
const USERNAME = 'rahulshettyacademy';
const PASSWORD = 'Learning@830$3mK2';

// ── Helper: wait for modal to appear then click the specified button ───────────
// Modal text: "You will be limited to only fewer functionalities. Proceed?"
// Buttons: #cancelBtn (stay on current) | #okayBtn (confirm switch)
async function waitForModalAndClick(page: Page, action: 'okay' | 'cancel') {
  const modal = page.locator('#myModal');
  // Wait for modal to become visible first
  await modal.waitFor({ state: 'visible', timeout: 5000 });

  const btnId = action === 'okay' ? '#okayBtn' : '#cancelBtn';
  await page.locator(btnId).click();

  // Wait for modal AND backdrop to fully disappear before continuing
  await modal.waitFor({ state: 'hidden', timeout: 5000 });
  await page.locator('.modal-backdrop').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300); // small buffer for animation to finish
}

test.describe('Login Page Tests - rahulshettyacademy', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await expect(page).toHaveTitle(/LoginPage Practise/);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.locator('#username').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('label[for="terms"]').click();
    await expect(page.locator('#terms')).toBeChecked();
    await page.locator('#signInBtn').click();

    await expect(page).not.toHaveURL(URL);
    await expect(page).toHaveURL(/shop/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.locator('#username').fill('wronguser');
    await page.locator('[type="password"]').fill('wrongpassword');
    await page.locator('label[for="terms"]').click();
    await page.locator('#signInBtn').click();

    await expect(page.locator('.alert-danger')).toBeVisible();
  });

  test('should not login without checking terms and conditions', async ({ page }) => {
    await page.locator('#username').fill(USERNAME);
    await page.locator('[type="password"]').fill(PASSWORD);
    // Intentionally skip terms checkbox
    await page.locator('#signInBtn').click();

    await expect(page).toHaveURL(URL);
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordField = page.locator('[type="password"]');
    await passwordField.fill(PASSWORD);
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('should switch between Admin and User roles', async ({ page }) => {
    const adminRadio = page.locator('input[value="admin"]');
    const userRadio = page.locator('input[value="user"]');

    // Admin should be selected by default
    await expect(adminRadio).toBeChecked();

    // Click User label — this triggers a modal on mobile
    await page.locator('label.customradio').filter({ hasText: 'User' }).click();

    // Modal appears: click Okay to confirm switching to User
    // We MUST wait for modal + backdrop to fully clear before any next action
    await waitForModalAndClick(page, 'okay');

    await expect(userRadio).toBeChecked();
    await expect(adminRadio).not.toBeChecked();

    // Now it's safe to click Admin label — backdrop is gone
    await page.locator('label.customradio').filter({ hasText: 'Admin' }).click();

    // Admin radio does NOT trigger a modal — just verify it's checked
    await expect(adminRadio).toBeChecked();
  });

});
