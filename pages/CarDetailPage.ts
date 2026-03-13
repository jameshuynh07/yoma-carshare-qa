import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CarDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get reservationPanel(): Locator {
    return this.page.locator('[class*="reservation"], [class*="booking-panel"]').first();
  }

  get estimatedCost(): Locator {
    return this.page.locator('text=/MMK [\\d,]+/').first();
  }

  get costDetailsLink(): Locator {
    return this.page.getByText(/cost details/i);
  }

  get loginToReserveButton(): Locator {
    return this.page.getByRole('button', { name: /login to reserve/i }).or(
      this.page.getByText(/login to reserve this car/i)
    );
  }

  get membershipGateMessage(): Locator {
    return this.page.getByText(/account is under the review/i);
  }

  get vehicleName(): Locator {
    return this.page.locator('h1, h2, [class*="vehicle-name"]').first();
  }

  async getEstimatedCostText(): Promise<string> {
    return (await this.estimatedCost.textContent()) ?? '';
  }

  async isGuestView(): Promise<boolean> {
    return this.loginToReserveButton.isVisible();
  }

  async isMembershipGateShown(): Promise<boolean> {
    return this.membershipGateMessage.isVisible();
  }
}
