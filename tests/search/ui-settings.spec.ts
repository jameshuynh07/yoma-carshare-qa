import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

// @regression — UI settings discovered during blind testing
// TC-STA-006: dark mode toggle switches html element class to 'dark'
// TC-STA-007: language toggle switches html[lang] from 'en' to 'mm'
//
// Discovery notes:
//   D-04: html class switches 'light' ↔ 'dark', style="color-scheme: dark" also updates
//   D-05: html[lang] switches 'en' ↔ 'mm'. Nav labels translate. Membership gate does NOT → BUG-012

test.describe('UI Settings — dark mode + language @regression', () => {

  test('TC-STA-006 | dark mode toggle applies dark class to html element', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const classBefore = await page.evaluate(
      () => document.documentElement.getAttribute('class') ?? ''
    );

    // find dark mode toggle — moon icon / sun icon / settings
    const toggle = page.locator(
      '[aria-label*="dark"], [class*="dark-toggle"], [class*="theme-toggle"], button[title*="dark"]'
    ).first();

    await toggle.click();
    await page.waitForTimeout(400);

    const classAfter = await page.evaluate(
      () => document.documentElement.getAttribute('class') ?? ''
    );
    const styleAfter = await page.evaluate(
      () => document.documentElement.getAttribute('style') ?? ''
    );

    // html class must contain 'dark' after toggle (D-04)
    expect(classAfter, 'TC-STA-006: html class should contain "dark" after toggle').toContain('dark');
    // color-scheme style also updates — confirmed via devtools
    expect(styleAfter).toContain('dark');
  });

  test('TC-STA-007 | language toggle switches html[lang] to mm', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const langBefore = await page.evaluate(
      () => document.documentElement.getAttribute('lang')
    );
    expect(langBefore, 'Should start in English').toBe('en');

    const langToggle = page.locator(
      '[aria-label*="lang"], [class*="lang-toggle"], [class*="language"], .globe-icon'
    ).first();

    await langToggle.click();
    await page.waitForTimeout(300);

    // select Myanmar option
    await page.locator(
      '[data-lang="mm"], [value="mm"], li:has-text("Myanmar"), li:has-text("မြန်မာ")'
    ).first().click();

    await page.waitForTimeout(500);

    const langAfter = await page.evaluate(
      () => document.documentElement.getAttribute('lang')
    );

    // html[lang] must switch to 'mm' (D-05)
    expect(langAfter, 'TC-STA-007: html[lang] should be "mm" after Myanmar selection').toBe('mm');
  });

});
