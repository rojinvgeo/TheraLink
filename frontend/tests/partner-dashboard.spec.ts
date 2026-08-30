import { test, expect } from '@playwright/test';

test.describe('Recruitment Partner Dashboard MVP Actions', () => {
  test.beforeEach(async ({ page }) => {
    // Log console messages and errors from the browser
    page.on('console', msg => {
      console.log(`[BROWSER LOG] [${msg.type()}]: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[BROWSER EXCEPTION]: ${err.message}`);
    });

    // Clear localStorage to ensure clean isolated context
    await page.addInitScript(() => {
      window.localStorage.clear();
      (window as any).Razorpay = function (options: any) {
        this.open = () => {
          console.log('[MOCK RAZORPAY] Modal opened. Triggering success callback...');
          if (options.handler) {
            options.handler({
              razorpay_order_id: options.order_id,
              razorpay_payment_id: 'pay_mock123',
              razorpay_signature: 'sig_mock123'
            });
          }
        };
        this.on = () => {};
      };
    });
  });

  test('should register a new partner, log in, browse candidates, request match, edit profile, and logout', async ({ page }) => {
    test.slow();
    const uniqueEmail = `dashboard-partner-${Date.now()}@test.com`;

    // 1. Register a new partner (active subscription)
    await page.goto('/partner/register');
    await page.fill('input[placeholder="Full Name"]', 'Daniel Partner Test');
    await page.fill('input[placeholder="Email Address"]', uniqueEmail);
    await page.fill('input[placeholder="Phone Number"]', '9898989898');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'password123');
    await page.click('button:has-text("Next")');

    await page.fill('input[placeholder="Company / Agency Name"]', 'Daniel Match Corp');
    await page.fill('input[placeholder="Website (Optional)"]', 'https://danielmatch.com');
    await page.selectOption('select', { label: 'India' });
    await page.click('button:has-text("Next")');

    // Verify redirected straight to Dashboard
    await expect(page).toHaveURL('/partner/dashboard', { timeout: 15000 });

    // 2. Validate Dashboard Overview Tab details
    const welcomeHeading = page.locator('h1:has-text("Welcome back")');
    await expect(welcomeHeading).toBeVisible();

    // 3. Tab to Browse Candidates
    await page.click('button:has-text("Browse Candidates")');
    const candTitle = page.locator('h2:has-text("Browse Available Candidates")');
    await expect(candTitle).toBeVisible();

    // Verify candidates are listed (seeded list has Arjun Mehta)
    const firstCandCard = page.locator('h4:has-text("Arjun")').first();
    await expect(firstCandCard).toBeVisible();

    // 4. Click Candidate Details for Arjun
    const card = page.locator('div.bg-white:has-text("Arjun")').first();
    const viewDetailBtn = card.locator('button:has-text("View Profile Details")');
    await viewDetailBtn.click();

    // Validate details side drawer
    const drawerTitle = page.locator('h3:has-text("Arjun")').first();
    await expect(drawerTitle).toBeVisible();

    // Fill match request notes and submit
    await page.fill('textarea[placeholder*="Add request notes"]', 'We are looking for a pediatric specialist for 6 months contract.');
    await page.click('button:has-text("Submit Match Request")');

    // Confirm request success alert
    const successMsg = page.locator('div:has-text("Match request has been recorded")').first();
    await expect(successMsg).toBeVisible({ timeout: 10000 });

    // 5. Tab to My Requests
    await page.click('button:has-text("My Requests")');
    const requestRow = page.locator('td:has-text("Arjun")').first();
    await expect(requestRow).toBeVisible();

    // 6. Tab to Company Profile and update details
    await page.click('button:has-text("Company Profile")');
    
    // Clear and fill company name
    const companyInput = page.locator('label:has-text("Company Name") + div input');
    await companyInput.fill('Daniel Renamed Corp');
    await page.click('button:has-text("Save Profile Details")');

    // Confirm profile saved alert
    const profileSuccessMsg = page.locator('div:has-text("updated successfully")').first();
    await expect(profileSuccessMsg).toBeVisible();

    // 7. Log out
    await page.click('button:has-text("Log Out")');
    await expect(page).toHaveURL('/partner/login', { timeout: 10000 });

    // 8. Try direct dashboard navigation while logged out
    await page.goto('/partner/dashboard');
    // Verify redirected back to Login page
    await expect(page).toHaveURL('/partner/login', { timeout: 10000 });
  });
});
