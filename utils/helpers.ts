import { Page } from '@playwright/test';

export async function waitForNetworkIdle(page: Page, timeout = 3000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return formatDate(d);
}
