import { test, expect } from '@playwright/test';

test.describe('Partner Registration Flow with Razorpay Payments', () => {
  test.beforeEach(async ({ page }) => {
    // Log console messages and errors from the browser
    page.on('console', msg => {
      console.log(`[BROWSER LOG] [${msg.type()}]: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[BROWSER EXCEPTION]: ${err.message}`);
    });

    // Log all partner API requests and responses
    page.on('request', request => {
      if (request.url().includes('/partner/')) {
        console.log(`[API REQUEST] URL: ${request.url()} Method: ${request.method()}`);
      }
    });
    page.on('response', async response => {
      if (response.url().includes('/partner/')) {
        try {
          const text = await response.text();
          console.log(`[API RESPONSE] URL: ${response.url()} Status: ${response.status()} Body: ${text}`);
        } catch (e) {
          // ignore binary/uncacheable
        }
      }
    });

    // Mock window.Razorpay globally with state control
    await page.addInitScript(() => {
      (window as any).mockPaymentStatus = 'success';
      (window as any).Razorpay = function (options: any) {
        this.open = () => {
          if ((window as any).mockPaymentStatus === 'success') {
            console.log('[MOCK RAZORPAY] Modal opened. Triggering success callback...');
            if (options.handler) {
              options.handler({
                razorpay_order_id: options.order_id,
                razorpay_payment_id: 'pay_mock123',
                razorpay_signature: 'sig_mock123'
              });
            }
          } else {
            console.log('[MOCK RAZORPAY] Modal opened. Simulating user dismiss/cancel...');
            if (options.modal && options.modal.ondismiss) {
              options.modal.ondismiss();
            }
          }
        };
        this.on = () => {};
      };
    });
  });

  test('should successfully register a partner, verify Razorpay payment, and redirect to home', async ({ page }) => {
    test.slow();
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

    // 4. Verify successful submission redirects to dashboard with extended timeout
    await expect(page).toHaveURL('/partner/dashboard', { timeout: 15000 });
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
    await expect(page).toHaveURL('/partner/dashboard', { timeout: 15000 });

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

  test('should handle payment cancellation and allow retry with same email', async ({ page }) => {
    test.slow();
    const retryEmail = `retry.${Date.now()}@test.com`;

    // 1. Go to register page
    await page.goto('/partner/register');

    // Toggle mock to cancel payment
    await page.evaluate(() => {
      (window as any).mockPaymentStatus = 'cancel';
    });

    // 2. Register first time
    await page.fill('input[placeholder="Full Name"]', 'Retry User');
    await page.fill('input[placeholder="Email Address"]', retryEmail);
    await page.fill('input[placeholder="Phone Number"]', '9876543210');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'password123');
    await page.click('button:has-text("Next")');
    await page.fill('input[placeholder="Company / Agency Name"]', 'Retry Agency');
    await page.selectOption('select', { label: 'United Kingdom' });
    await page.click('button:has-text("Next")');

    // 3. Assert "Payment Pending" retry form card is visible
    const retryHeader = page.locator('h3:has-text("Payment Pending")');
    await expect(retryHeader).toBeVisible({ timeout: 15000 });

    // 4. Update mock to trigger payment SUCCESS on retry
    await page.evaluate(() => {
      (window as any).mockPaymentStatus = 'success';
    });

    // 5. Fill and submit retry form
    await page.fill('input[placeholder="e.g. partner@agency.com"]', retryEmail);
    await page.click('button:has-text("Pay ₹2,500 Now")');

    // 6. Assert success redirect to dashboard
    await expect(page).toHaveURL('/partner/dashboard', { timeout: 15000 });
  });
});
