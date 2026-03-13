import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SignInPage } from '../../pages/SignInPage';

/**
 * BUG-012 | MEDIUM
 * Membership gate message NOT translated when lang=mm
 *
 * When user switches UI to Myanmar language (html[lang]="mm"),
 * most nav labels and UI strings translate correctly.
 * However the membership gate message stays in English:
 * "Your Yoma Car Share account is under the review..."
 *
 * Root cause hypothesis: hardcoded string, not wired to i18n keys.
 * Repro: Switch lang → mm → Sign in → view membership gate.
 * Status: OPEN — confirmed March 2026.
 */

/**
 * BUG-013 | CRITICAL
 * Duplicate notification fires on registration / booking confirm
 *
 * User receives the same notification twice (2 identical entries in
 * notification panel Activities tab).
 *
 * CROSS-PLATFORM confirmed:
 *   - Web: triggers on registration flow
 *   - iOS App Store v2.9.5: triggers on booking confirm
 *
 * Root cause hypothesis: backend event fires twice — no deduplication
 * on the notification service. Not a frontend issue.
 *
 * Repro (web): Register new account → open notification bell → Activities tab.
 * Repro (iOS): Complete booking → open notification panel.
 * Status: OPEN — backend fix required.
 */

test.describe('BUG-012 — i18n: membership gate not translated @bugs', () => {

  test('membership gate message must translate when lang=mm', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Switch UI to Myanmar language
    const langToggle = page.locator(
      '[aria-label*="lang"], .lang-toggle, [class*="language"], [title*="language"]'
    ).first();

    if (await langToggle.isVisible()) {
      await langToggle.click();
      await page.locator('[data-lang="mm"], [value="mm"], text=Myanmar, text=မြန်မာ').first().click();
      await page.waitForTimeout(600);
    }

    // Verify html[lang] switched
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang, 'Language should have switched to mm').toBe('mm');

    // Navigate to sign in
    await page.goto('/account/signin');
    await page.waitForLoadState('domcontentloaded');

    // Membership gate text — should be in Burmese, not English
    // This assertion FAILS by design to document BUG-012
    const gateMsg = page.locator(
      'text=Your Yoma Car Share account is under the review'
    );

    const isEnglishGateVisible = await gateMsg.isVisible().catch(() => false);

    expect(
      isEnglishGateVisible,
      'BUG-012: Membership gate still in English when lang=mm — i18n key missing'
    ).toBe(false);
  });

});

test.describe('BUG-013 — Duplicate notification on registration @bugs', () => {

  test('registration must fire exactly one notification, not two', async ({ page }) => {
    // Note: this test reaches sign-up page only — full registration
    // requires a live account. The assertion documents the expected
    // behaviour; confirm manually with test account.
    //
    // CROSS-PLATFORM: also confirmed on iOS App Store v2.9.5 (booking confirm event)
    // Backend root cause — deduplication missing on notification service.

    await page.goto('/account/signup');
    await page.waitForLoadState('domcontentloaded');

    const signIn = new SignInPage(page);
    await signIn.goto();

    // Verify bell icon exists — prerequisite for notif test
    const bell = page.locator(
      '[aria-label*="notification"], [class*="bell"], [class*="notif-icon"]'
    ).first();

    await expect(bell, 'Notification bell must be accessible from auth pages').toBeVisible();

    // Manual verification note:
    // After registration → Activities tab → expect 1 entry "Membership Registration Completed"
    // Actual (BUG-013): 2 identical entries appear
    //
    // Marking test as todo until account can be reset for re-registration
    test.fail(true, 'BUG-013: Duplicate notification confirmed — web + iOS App Store v2.9.5. Backend deduplication missing.');
  });

});
