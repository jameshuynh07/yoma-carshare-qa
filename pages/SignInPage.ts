import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/account/signin');
    await this.page.waitForLoadState('domcontentloaded');
  }

  get emailInput(): Locator {
    return this.page.getByPlaceholder(/enter email/i).or(
      this.page.locator('input[type="email"]').first()
    );
  }

  get passwordInput(): Locator {
    return this.page.getByPlaceholder(/enter password/i).or(
      this.page.locator('input[type="password"]').first()
    );
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: /login/i });
  }

  get forgotPasswordLink(): Locator {
    return this.page.getByText(/forgot password/i);
  }

  get createAccountLink(): Locator {
    return this.page.getByText(/create an account/i);
  }

  get joinNowPromoCard(): Locator {
    return this.page.getByText(/not yet registered/i).or(
      this.page.getByRole('button', { name: /join now for free/i })
    );
  }

  get welcomeBackHeading(): Locator {
    return this.page.getByRole('heading', { name: /welcome back/i });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  getSearchParamsFromUrl(): URLSearchParams {
    return new URL(this.page.url()).searchParams;
  }
}
