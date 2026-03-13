import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { CarDetailPage } from '../../pages/CarDetailPage';
import { SignInPage } from '../../pages/SignInPage';
import { LOCATIONS, DATES } from '../../fixtures/test-data';

test.describe('Guest User Flow @regression', () => {
  let home: HomePage;
  let results: SearchResultsPage;
  let carDetail: CarDetailPage;
  let signIn: SignInPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    results = new SearchResultsPage(page);
    carDetail = new CarDetailPage(page);
    signIn = new SignInPage(page);
    await home.goto();
  });

  test('TC-REG-009 | Sign In page renders Welcome Back form', async () => {
    await home.navSignIn.click();
    await expect(signIn.welcomeBackHeading).toBeVisible();
    await expect(signIn.emailInput).toBeVisible();
    await expect(signIn.passwordInput).toBeVisible();
    await expect(signIn.loginButton).toBeVisible();
    await expect(signIn.forgotPasswordLink).toBeVisible();
    await expect(signIn.createAccountLink).toBeVisible();
  });

  test('TC-STA-008 | Sign In page shows JOIN NOW FOR FREE promo card', async () => {
    await home.navSignIn.click();
    await expect(signIn.joinNowPromoCard).toBeVisible();
  });

  test('TC-CAR-004 | guest can view car detail with full info and Login CTA', async ({ page }) => {
    await home.search(
      LOCATIONS.mandalayCity,
      LOCATIONS.mandalayAirport,
      DATES.pickup,
      DATES.returnDate
    );

    await expect(results.resultsHeader).toBeVisible();
    await results.carCards.first().click();
    await page.waitForLoadState('domcontentloaded');

    // Guest sees full detail — NOT hard blocked
    await expect(carDetail.reservationPanel).toBeVisible();
    await expect(carDetail.estimatedCost).toBeVisible();
    await expect(carDetail.loginToReserveButton).toBeVisible();

    // Confirm no membership gate message (that's for logged-in-under-review users)
    await expect(carDetail.membershipGateMessage).not.toBeVisible();
  });

  test('TC-CAR-005 | Login to reserve redirects with search params preserved', async ({ page }) => {
    await home.search(
      LOCATIONS.mandalayCity,
      LOCATIONS.mandalayAirport,
      DATES.pickup,
      DATES.returnDate
    );

    await results.carCards.first().click();
    await page.waitForLoadState('domcontentloaded');

    await carDetail.loginToReserveButton.click();
    await page.waitForLoadState('domcontentloaded');

    // URL must contain search params — ensures seamless return after login
    const url = new URL(page.url());
    expect(url.pathname).toContain('signin');
    expect(url.searchParams.has('pickup_location')).toBeTruthy();
    expect(url.searchParams.has('pickup_date')).toBeTruthy();
    expect(url.searchParams.has('return_date')).toBeTruthy();
  });
});
