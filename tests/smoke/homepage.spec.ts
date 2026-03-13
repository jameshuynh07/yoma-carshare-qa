import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Smoke — Homepage @smoke', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test('TC-STA-001 | homepage loads with nav and Find A Car form', async () => {
    await expect(home.navFindACar).toBeVisible();
    await expect(home.navLocations).toBeVisible();
    await expect(home.navSignIn).toBeVisible();
    await expect(home.navSignUp).toBeVisible();
    await expect(home.findACarButton).toBeVisible();
  });

  test('TC-CAR-001 | Find A Car form renders all required fields', async () => {
    await expect(home.findACarButton).toBeEnabled();
    await expect(home.pickupLocationInput).toBeVisible();
    await expect(home.pickupDateInput).toBeVisible();
    await expect(home.returnDateInput).toBeVisible();
  });

  test('TC-CAR-006 | return to different location checkbox reveals field', async () => {
    await expect(home.returnLocationInput).not.toBeVisible();
    await home.returnDifferentLocationCheckbox.check();
    await expect(home.returnLocationInput).toBeVisible();
  });
});
