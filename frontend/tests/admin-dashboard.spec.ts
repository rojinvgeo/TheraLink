import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Partners Tab Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log console messages and errors from the browser
    page.on('console', msg => {
      console.log(`[BROWSER LOG] [${msg.type()}]: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[BROWSER EXCEPTION]: ${err.message}`);
    });
  });

  test('should log in as admin, navigate to Partners tab, and verify content', async ({ page }) => {
    test.slow();

    // 1. Navigate to login
    await page.goto('/admin/login');

    // 2. Log in
    await page.fill('input#username', 'admin');
    await page.fill('input#password', 'admin123');
    await page.click('button:has-text("Access Staff Console")');

    // 3. Verify landing on dashboard
    await expect(page).toHaveURL('/admin/dashboard', { timeout: 15000 });

    // 4. Click the Partners tab in the sidebar
    await page.click('button:has-text("Partners")');

    // 5. Verify the Partners header panel is visible
    const partnersHeader = page.locator('h2:has-text("Registered Partners")');
    await expect(partnersHeader).toBeVisible();

    // 6. Verify table headers are visible
    await expect(page.locator('th:has-text("Company")')).toBeVisible();
    await expect(page.locator('th:has-text("Contact Person")')).toBeVisible();

    // 7. Verify search functionality works
    const searchInput = page.locator('input[placeholder*="Search by company name"]');
    await expect(searchInput).toBeVisible();
    
    // Type something that matches nothing
    await searchInput.fill('NonExistentPartnerQueryStringXYZ');
    await expect(page.locator('p:has-text("No partners found")')).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('p:has-text("No partners found")')).not.toBeVisible();
  });
});
