import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get resultsHeader(): Locator {
    return this.page.locator('text=/Found \\d+ Car/i');
  }

  get carCards(): Locator {
    return this.page.locator('[class*="car-card"], [class*="vehicle-card"], [class*="car-item"]');
  }

  get categoryHeaders(): Locator {
    return this.page.locator('[class*="category"], [class*="vehicle-type"], h2, h3').filter({
      hasText: /Economy|SUV|Compact|7 Seaters|14 Seaters/,
    });
  }

  get emptyState(): Locator {
    return this.page.getByText(/car not found/i);
  }

  async getResultCount(): Promise<number> {
    const text = await this.resultsHeader.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async getCategories(): Promise<string[]> {
    const headers = await this.categoryHeaders.allTextContents();
    return headers.map(h => h.trim()).filter(Boolean);
  }

  async clickFirstCarInCategory(category: string): Promise<void> {
    const section = this.page.locator(`text=${category}`).locator('..').locator('..');
    await section.locator('[class*="car-card"], [class*="vehicle"]').first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
