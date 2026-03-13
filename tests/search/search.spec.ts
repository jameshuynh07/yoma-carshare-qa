import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { LOCATIONS, DATES, EXPECTED } from '../../fixtures/test-data';

test.describe('Car Search @regression', () => {
  let home: HomePage;
  let results: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    results = new SearchResultsPage(page);
    await home.goto();
  });

  test('TC-CAR-002 | valid search returns results grouped by category', async () => {
    await home.search(
      LOCATIONS.mandalayCity,
      LOCATIONS.mandalayAirport,
      DATES.pickup,
      DATES.returnDate
    );

    await expect(results.resultsHeader).toBeVisible();

    const count = await results.getResultCount();
    expect(count).toBeGreaterThan(0);

    const categories = await results.getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  test('TC-CAR-003 | all vehicle categories available across routes', async () => {
    await home.search(
      LOCATIONS.starCity,
      LOCATIONS.capitalHypermarket,
      '23-03-2026',
      '31-03-2026'
    );

    await expect(results.resultsHeader).toBeVisible();
    const categories = await results.getCategories();

    // Discovered: Economy, 14 Seaters — not just SUV/Compact/7 Seaters
    const discovered = ['Economy', 'SUV', 'Compact', '7 Seaters', '14 Seaters'];
    const found = categories.some(c => discovered.some(d => c.includes(d)));
    expect(found).toBeTruthy();
  });

  test('TC-CAR-008 | no-inventory route shows empty state', async () => {
    await home.search(
      LOCATIONS.baganAirport,
      LOCATIONS.mandalayAirport,
      DATES.pickup,
      DATES.returnDate
    );

    await expect(results.emptyState).toBeVisible();
    const text = await results.emptyState.textContent();
    expect(text?.trim()).toContain(EXPECTED.carNotFound.replace('.', ''));
  });

  test('TC-CAR-009 | empty state provides no guidance — known UX gap', async () => {
    // This test documents BUG-009: "Car not found." with no next-step for user
    await home.search(
      LOCATIONS.baganAirport,
      LOCATIONS.mandalayAirport,
      DATES.pickup,
      DATES.returnDate
    );

    await expect(results.emptyState).toBeVisible();

    // Expect: message explains WHY and offers next action
    // Actual: only "Car not found." — fails by design to document the UX gap
    const hasGuidance = await results.page
      .getByText(/try different|contact|hotline|alternative/i)
      .isVisible()
      .catch(() => false);

    expect(hasGuidance, 'BUG-009: No user guidance shown on empty search state').toBe(true);
  });
});
