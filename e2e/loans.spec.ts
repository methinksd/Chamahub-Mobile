import { test, expect } from '@playwright/test';

test.describe('Loan Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login first
    await page.goto('/login');
    // Skip login for now - requires backend
    test.skip();
  });

  test.skip('should display loans page after login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('ion-tab-button[tab="loans"]');
    
    await expect(page).toHaveURL(/.*loans/);
    await expect(page.locator('ion-title')).toContainText(/loans/i);
  });

  test.skip('should open loan application form', async ({ page }) => {
    await page.goto('/dashboard/loans');
    
    // Click apply for loan button
    await page.click('ion-button:has-text("Apply")');
    
    // Form should appear (could be modal or new page)
    await expect(page.locator('form, ion-modal')).toBeVisible();
  });

  test.skip('should validate loan application form', async ({ page }) => {
    await page.goto('/dashboard/loans');
    await page.click('ion-button:has-text("Apply")');
    
    // Try submitting empty form
    await page.click('button[type="submit"]');
    
    // Validation errors should appear
    await expect(page.locator('.error, ion-text[color="danger"]')).toBeVisible();
  });

  test.skip('should submit loan application successfully', async ({ page }) => {
    await page.goto('/dashboard/loans');
    await page.click('ion-button:has-text("Apply")');
    
    // Fill form
    await page.fill('input[name="amount"]', '50000');
    await page.selectOption('select[name="term"]', '12');
    await page.fill('textarea[name="purpose"]', 'Business expansion');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Success feedback
    await expect(page.locator('ion-toast')).toContainText(/success|submitted/i);
    
    // Should show in loans list
    await expect(page.locator('ion-card:has-text("50000")')).toBeVisible({ timeout: 5000 });
  });

  test.skip('should filter loans by status', async ({ page }) => {
    await page.goto('/dashboard/loans');
    
    // Select filter
    await page.selectOption('select[name="status"]', 'PENDING');
    
    // Only pending loans should show
    await expect(page.locator('ion-badge:has-text("PENDING")')).toHaveCount(await page.locator('ion-card').count());
  });
});
