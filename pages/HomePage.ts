import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  constructor(page: Page) {
    super(page, 'https://example.com');
  }

  async open() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async getHeading(): Promise<string> {
    return await this.page.locator('h1').innerText();
  }

  async clickMoreInfo() {
    await this.page.getByRole('link', { name: 'More information...' }).click();
  }

  async assertHeadingVisible() {
    await expect(this.page.locator('h1')).toBeVisible();
  }
}
