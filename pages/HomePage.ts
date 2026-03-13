import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  get findACarForm(): Locator {
    return this.page.locator('form, [class*="find-car"], [class*="search-form"]').first();
  }

  get pickupLocationInput(): Locator {
    return this.page.getByPlaceholder(/pick.?up location/i).or(
      this.page.locator('[placeholder*="Pick-up"], [placeholder*="pickup"]').first()
    );
  }

  get returnDifferentLocationCheckbox(): Locator {
    return this.page.getByLabel(/return to a different/i).or(
      this.page.locator('input[type="checkbox"]').first()
    );
  }

  get returnLocationInput(): Locator {
    return this.page.getByPlaceholder(/return location/i).or(
      this.page.locator('[placeholder*="Return"]').first()
    );
  }

  get pickupDateInput(): Locator {
    return this.page.locator('input[placeholder*="Pick-up Date"], input[name*="pickup_date"]').first();
  }

  get returnDateInput(): Locator {
    return this.page.locator('input[placeholder*="Return Date"], input[name*="return_date"]').first();
  }

  get findACarButton(): Locator {
    return this.page.getByRole('button', { name: /find a car/i });
  }

  async search(pickupLocation: string, returnLocation: string, pickupDate: string, returnDate: string) {
    await this.pickupLocationInput.fill(pickupLocation);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);

    await this.returnDifferentLocationCheckbox.check();
    await this.returnLocationInput.fill(returnLocation);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);

    await this.pickupDateInput.fill(pickupDate);
    await this.returnDateInput.fill(returnDate);
    await this.findACarButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
