import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async clickAndWait(locator: Locator) {
    await locator.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  get navFindACar(): Locator {
    return this.page.getByRole('link', { name: 'FIND A CAR' });
  }

  get navLocations(): Locator {
    return this.page.getByRole('link', { name: 'LOCATIONS' });
  }

  get navSignIn(): Locator {
    return this.page.getByRole('link', { name: 'SIGN IN' });
  }

  get navSignUp(): Locator {
    return this.page.getByRole('link', { name: 'SIGN UP' });
  }
}
