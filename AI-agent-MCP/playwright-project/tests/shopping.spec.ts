import { test, expect, Page } from '@playwright/test';

const LOGIN_URL = 'https://rahulshettyacademy.com/loginpagePractise/';
const USERNAME = 'rahulshettyacademy';
const PASSWORD = 'Learning@830$3mK2';
const PRODUCT_NAME = 'iphone X'; 

// ── Helper: login ─────────────────────────────────────────────────────────────
async function login(page: Page) {
  await page.goto(LOGIN_URL);
  await expect(page).toHaveTitle(/LoginPage Practise/);
  await page.locator('#username').fill(USERNAME);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('label[for="terms"]').click();
  await expect(page.locator('#terms')).toBeChecked();
  await page.locator('#signInBtn').click();
  await page.waitForURL('**/shop**', { timeout: 15000 });
  await page.waitForSelector('app-card', { timeout: 10000 });
}

// ── Helper: open collapsed mobile navbar ─────────────────────────────────────
async function ensureNavOpen(page: Page) {
  const checkoutBtn = page.locator('a.nav-link.btn-primary');
  const alreadyVisible = await checkoutBtn.isVisible();
  if (alreadyVisible) return;

  const toggler = page.locator('button.navbar-toggler');
  if (await toggler.isVisible()) {
    await toggler.tap();
    await checkoutBtn.waitFor({ state: 'visible', timeout: 5000 });
  }
}

test.describe('Shopping Cart', () => {

  test('should login, add iPhone X to cart, checkout and verify product', async ({ page }) => {

    // ── Step 1 & 2: Login ────────────────────────────────────────────────────
    await login(page);

    // ── Step 3: Find iPhone X card and verify it is displayed ─────────────────
    const iphoneCard = page.locator('app-card').filter({ hasText: PRODUCT_NAME });
    await expect(iphoneCard).toBeVisible();
    await expect(iphoneCard.locator('h4.card-title')).toHaveText(PRODUCT_NAME);
    await expect(iphoneCard.locator('h5')).toHaveText('$24.99');

    // ── Step 4: Add iPhone X to cart ────────────────────────────────────────
    const addBtn = iphoneCard.locator('button.btn-info');
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.tap().catch(() => addBtn.click());

    // ── Step 5: Verify cart count updated to 1 ──────────────────────────────
    await ensureNavOpen(page);
    const checkoutBtn = page.locator('a.nav-link.btn-primary');
    await expect(checkoutBtn).toContainText('Checkout ( 1 )');

    // ── Step 6: Click Checkout ───────────────────────────────────────────────
    await checkoutBtn.tap().catch(() => checkoutBtn.click());
    await page.waitForTimeout(2000);

    // ── Step 7: Verify checkout view shows iPhone X ───────────────────────────
    // The checkout view is an in-place SPA render — URL stays the same.
    // Price shown on checkout is in ₹ (rupees), not $, so we verify by
    // product name and "In Stock" status only.
    await expect(page.locator('body')).toContainText(PRODUCT_NAME, { timeout: 8000 });
    await expect(page.locator('body')).toContainText('In Stock', { timeout: 8000 });
    await expect(page.locator('body')).toContainText('Checkout', { timeout: 8000 });
  });

  test('should verify cart count increments after adding iPhone X', async ({ page }) => {

    // ── Login ────────────────────────────────────────────────────────────────
    await login(page);

    // ── Assert initial cart count is 0 ───────────────────────────────────────
    await ensureNavOpen(page);
    await expect(page.locator('a.nav-link.btn-primary')).toContainText('Checkout ( 0 )');

    // ── Add iPhone X to cart ─────────────────────────────────────────────────
    const iphoneCard = page.locator('app-card').filter({ hasText: PRODUCT_NAME });
    const addBtn = iphoneCard.locator('button.btn-info');
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.tap().catch(() => addBtn.click());

    // ── Assert cart count is now 1 ───────────────────────────────────────────
    await ensureNavOpen(page);
    await expect(page.locator('a.nav-link.btn-primary')).toContainText('Checkout ( 1 )');
  });

});
