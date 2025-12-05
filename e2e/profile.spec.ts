import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Requires login
    await page.goto('/');
    test.skip();
  });

  test.skip('should display user profile information', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('ion-tab-button[tab="profile"]');
    
    await expect(page).toHaveURL(/.*profile/);
    
    // Should show user info
    await expect(page.locator('ion-avatar')).toBeVisible();
    await expect(page.locator('text=/username|email/i')).toBeVisible();
  });

  test.skip('should open photo picker on avatar click', async ({ page }) => {
    await page.goto('/dashboard/profile');
    
    // Click avatar or camera button
    await page.click('ion-avatar, ion-button:has(ion-icon[name="camera"])');
    
    // Action sheet should appear
    await expect(page.locator('ion-action-sheet')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('button:has-text("Take Photo")')).toBeVisible();
    await expect(page.locator('button:has-text("Choose from Gallery")')).toBeVisible();
  });

  test.skip('should logout successfully', async ({ page }) => {
    await page.goto('/dashboard/profile');
    
    // Click logout button
    await page.click('ion-button:has-text("Logout")');
    
    // Confirm dialog
    await expect(page.locator('ion-alert')).toBeVisible();
    await page.click('button:has-text("Logout")');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
  });
});
