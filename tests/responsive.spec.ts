import { test, expect } from '@playwright/test';

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
]) {
  test(`all routes remain usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of [
      'home',
      'chat',
      'write',
      'read',
      'translate',
      'image',
      'video',
      'compare',
      'mcp',
      'history',
      'prompts',
      'models',
      'settings',
    ]) {
      await page.goto(`/#/${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      expect(
        await page.locator('main').evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test('mobile navigation opens, changes page, and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const drawer = page.getByRole('dialog', { name: 'Navigation', exact: true });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('link', { name: 'Write', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'The right words, a little easier.' }),
  ).toBeVisible();
  await expect(drawer).not.toBeVisible();
});
