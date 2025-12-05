import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/Chamahub/i);
    await expect(page.locator('h1, ion-title')).toContainText(/login/i);
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    
    // Form should remain on page (not navigate)
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[name="identifier"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    // Wait for error toast
    await expect(page.locator('ion-toast')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('ion-toast')).toContainText(/invalid|error/i);
  });

  test.skip('should login successfully with valid credentials', async ({ page }) => {
    // NOTE: Requires backend running with test user
    await page.fill('input[name="identifier"]', 'testuser');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    // Should navigate to either dashboard or select-chama
    await expect(page).toHaveURL(/\/(dashboard|select-chama)/, { timeout: 10000 });
    
    // Success toast should appear
    await expect(page.locator('ion-toast')).toContainText(/success/i);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('a[href*="signup"]');
    await expect(page).toHaveURL(/.*signup/);
  });
});
