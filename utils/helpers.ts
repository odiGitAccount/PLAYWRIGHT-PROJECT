import { Page } from '@playwright/test';

/**
 * Wait for a given number of milliseconds
 */
export async function waitMs(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry an action up to maxAttempts times
 */
export async function retryAction(
  action: () => Promise<void>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await action();
      return;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await waitMs(delayMs);
    }
  }
}

/**
 * Generate a random string of given length
 */
export function randomString(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Get current timestamp as formatted string
 */
export function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Scroll to bottom of the page
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}
