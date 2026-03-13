import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LOCATIONS, DATES } from '../../fixtures/test-data';

/**
 * BUG-005 | CRITICAL
 * Race condition — rapid consecutive searches trigger Sentry crash modal
 *
 * Root cause hypothesis: Each FIND A CAR click fires a new API request.
 * When responses return out of order, React state becomes inconsistent
 * and throws an unhandled exception — caught by Sentry in production.
 *
 * Repro: Confirmed during blind testing, March 2026.
 * Status: OPEN — not yet fixed as of assessment date.
 */
test.describe('BUG-005 — Race Condition: Rapid Search @bugs', () => {
  test('rapid consecutive searches must not crash the application', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.pickupLocationInput.fill(LOCATIONS.mandalayCity);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);

    await home.pickupDateInput.fill(DATES.pickup);
    await home.returnDateInput.fill(DATES.returnDate);

    // Simulate rapid repeated search — 5 clicks within ~3 seconds
    for (let i = 0; i < 5; i++) {
      await home.findACarButton.click();
      await page.waitForTimeout(300);
      const newDate = `${14 + i}-03-2026`;
      await home.pickupDateInput.fill(newDate);
    }

    await page.waitForTimeout(2000);

    // Sentry crash modal must NOT appear
    const sentryModal = page.getByText(/it looks like we.?re having issues/i);
    const crashed = await sentryModal.isVisible().catch(() => false);

    expect(crashed, 'BUG-005: Sentry crash modal appeared — race condition confirmed in production').toBe(false);
  });
});
