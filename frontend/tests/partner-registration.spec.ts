import { test, expect } from '@playwright/test';

test.describe('Partner Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log console messages and errors from the browser
    page.on('console', msg => {
      console.log(`[BROWSER LOG] [${msg.type()}]: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[BROWSER EXCEPTION]: ${err.message}`);
      console.error(err.stack);
    });
  });

  test('should successfully register a partner and redirect to home', async ({ page }) => {
    test.slow(); // Marks this test as slow, tripling the default timeout to accommodate SQLite write latencies.
    const uniqueEmail = `partner.${Date.now()}@test.com`;

    // 1. Go to register page
    await page.goto('/partner/register');

    // 2. Step 1 form submission
    await page.fill('input[placeholder="Full Name"]', 'Jane Partner Test');
    await page.fill('input[placeholder="Email Address"]', uniqueEmail);
    await page.fill('input[placeholder="Phone Number"]', '9876543210');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'password123');
    
    await page.click('button:has-text("Next")');

    // 3. Step 2 form submission
    await page.fill('input[placeholder="Company / Agency Name"]', 'Jane Agency Group');
    await page.fill('input[placeholder="Website (Optional)"]', 'janeagency.com');
    await page.selectOption('select', { label: 'Canada' });

    // Submit registration (Next button on step 2)
    await page.click('button:has-text("Next")');

    // 4. Verify successful submission redirects to home with extended timeout
    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('should fail when passwords do not match', async ({ page }) => {
    await page.goto('/partner/register');

    // Fill details with mismatched passwords
    await page.fill('input[placeholder="Full Name"]', 'Jane Partner');
    await page.fill('input[placeholder="Email Address"]', 'mismatch@test.com');
    await page.fill('input[placeholder="Phone Number"]', '9876543210');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'wrongpassword');

    await page.click('button:has-text("Next")');

    // Verify step 1 validation error is shown under Confirm Password field
    const errorMsg = page.locator('span.form-error-msg:has-text("Passwords do not match.")');
    await expect(errorMsg).toBeVisible();
  });

  test('should show validation error for duplicate email registration', async ({ page }) => {
    test.slow();
    const duplicateEmail = `duplicate.${Date.now()}@test.com`;

    // Register first time
    await page.goto('/partner/register');
    await page.fill('input[placeholder="Full Name"]', 'First User');
    await page.fill('input[placeholder="Email Address"]', duplicateEmail);
    await page.fill('input[placeholder="Phone Number"]', '1112223333');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'password123');
    await page.click('button:has-text("Next")');
    await page.fill('input[placeholder="Company / Agency Name"]', 'First Agency');
    await page.selectOption('select', { label: 'United States' });
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL('/', { timeout: 15000 });

    // Try registering a second time with the same email
    await page.goto('/partner/register');
    await page.fill('input[placeholder="Full Name"]', 'Second User');
    await page.fill('input[placeholder="Email Address"]', duplicateEmail);
    await page.fill('input[placeholder="Phone Number"]', '4445556666');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'password123');
    await page.click('button:has-text("Next")');
    await page.fill('input[placeholder="Company / Agency Name"]', 'Second Agency');
    await page.selectOption('select', { label: 'United States' });
    await page.click('button:has-text("Next")');

    // Assert that we are returned to step 1 and the unique email validation error is displayed
    const emailError = page.locator('span.form-error-msg:has-text("A user with this email address already exists.")');
    await expect(emailError).toBeVisible({ timeout: 15000 });
  });
});
