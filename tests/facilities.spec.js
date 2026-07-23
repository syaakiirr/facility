const { test, expect } = require('@playwright/test');

// Load env variables
const adminEmail = process.env.TEST_ADMIN_EMAIL;
const adminPassword = process.env.TEST_ADMIN_PASSWORD;
const staffEmail = process.env.TEST_STAFF_EMAIL;
const staffPassword = process.env.TEST_STAFF_PASSWORD;

// Helper to check if credentials are set
const checkCredentials = () => {
  if (!adminEmail || !adminPassword || !staffEmail || !staffPassword) {
    throw new Error(
      'MISSING CREDENTIALS: Playwright tests require TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, ' +
      'TEST_STAFF_EMAIL, and TEST_STAFF_PASSWORD to be defined in your .env file.'
    );
  }
};

test.describe('Kak Effa Facilities Dashboard — E2E Tests', () => {
  
  test.beforeAll(() => {
    checkCredentials();
  });

  // Helper login function
  async function login(page, email, password) {
    await page.goto('/pages/login.html');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('#btn-login');
    await page.waitForURL('**/index.html**');
  }

  test('Test Case 1: Authentication Failures & UI', async ({ page }) => {
    await page.goto('/pages/login.html');
    
    // Check titles and elements
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('.login-logo-text')).toContainText('Kak Effa');
    
    // Login with invalid credentials
    await page.fill('#email', 'wronguser@test.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#btn-login');
    
    // Check error toast/box
    const errorBox = page.locator('#error-box');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(/Incorrect email or password|Invalid login credentials/);
  });

  test('Test Case 2: Successful Login & Dashboard KPI Check', async ({ page }) => {
    await login(page, adminEmail, adminPassword);
    
    // Verify redirection & shell elements
    await expect(page.locator('#topbar-title')).toContainText('Dashboard');
    await expect(page.locator('#user-name')).toContainText(adminEmail);
    await expect(page.locator('#sidebar-user-role')).toContainText('Super Admin');

    // Verify KPI Cards exist
    await expect(page.locator('#kpi-total')).toBeVisible();
    await expect(page.locator('#kpi-done')).toBeVisible();
    await expect(page.locator('#kpi-progress')).toBeVisible();
    await expect(page.locator('#kpi-requested')).toBeVisible();
    await expect(page.locator('#kpi-approved')).toBeVisible();
  });

  test('Test Case 3: Navigation via Sidebar', async ({ page }) => {
    await login(page, adminEmail, adminPassword);

    const pages = ['applications', 'companies', 'banks', 'reports', 'bos_review', 'settings'];
    
    for (const pageKey of pages) {
      await page.click(`[data-page="${pageKey}"]`);
      const expectedTitle = pageKey === 'bos_review' ? /hod review|bos review/i : new RegExp(pageKey.replace('_', ' '), 'i');
      await expect(page.locator('#topbar-title')).toContainText(expectedTitle);
      await page.waitForTimeout(200); // Short delay to let page render
    }
  });

  test('Test Case 4: Applications CRUD Operations', async ({ page }) => {
    await login(page, adminEmail, adminPassword);
    
    // Go to Applications page
    await page.click('[data-page="applications"]');
    await expect(page.locator('#topbar-title')).toContainText('Applications');

    // Generate unique company name for this test run
    const testCompanyName = `Test Company ${Date.now()}`;
    
    // --- 1. CREATE ---
    await page.click('#btn-add-app');
    await expect(page.locator('#modal-app-title')).toContainText('New Application');
    
    // Fill in modal details
    await page.selectOption('#app-form select[name="category"]', 'COMPANY');
    await page.fill('#app-form input[name="company"]', testCompanyName);
    await page.fill('#app-form input[name="year_application"]', '2026');
    await page.selectOption('#app-form select[name="bank"]', 'BSN');
    await page.selectOption('#app-form select[name="type_facility"]', 'TERM LOAN');
    await page.fill('#app-form input[name="name_facility"]', 'Test Facility Alpha');
    await page.fill('#app-form input[name="collateral"]', 'FD');
    await page.fill('#app-form input[name="profit_rate"]', '5.5%');
    await page.fill('#app-form input[name="rate_tenure"]', '5 YEARS');
    await page.selectOption('#app-form select[name="status"]', 'PENDING');
    await page.fill('#app-form input[name="total_requested"]', '500000');
    await page.fill('#app-form input[name="total_approved"]', '0');
    await page.fill('#app-form textarea[name="notes"]', 'E2E testing notes here.');

    // Save
    await page.click('#btn-save-app');
    
    // Check success toast
    await expect(page.getByText('Application added successfully')).toBeVisible();
    
    // --- 2. READ & SEARCH ---
    await page.fill('#app-search', testCompanyName);
    await page.waitForTimeout(500); // Filter debounce
    
    const tableBody = page.locator('#apps-table-container table tbody');
    await expect(tableBody).toContainText(testCompanyName);

    // --- 3. UPDATE ---
    // Click edit button
    await page.click('#apps-table-container table tbody tr >> button[title="Edit"]');
    await expect(page.locator('#modal-app-title')).toContainText('Edit Application');
    
    // Change total approved and status
    await page.fill('#app-form input[name="total_approved"]', '450000');
    await page.selectOption('#app-form select[name="status"]', 'IN FORCE');
    await page.click('#btn-save-app');
    
    // Toast update check
    await expect(page.getByText('Application updated successfully')).toBeVisible();

    // Verify change in table
    await page.fill('#app-search', testCompanyName);
    await page.waitForTimeout(500);
    await expect(tableBody).toContainText('IN FORCE');

    // --- 4. DELETE ---
    await page.click('#apps-table-container table tbody tr >> button[title="Delete"]');
    
    // Click yes on custom HTML confirmation dialog
    await page.click('#confirm-yes');
    
    // Check delete success toast
    await expect(page.getByText('Application deleted successfully')).toBeVisible();
    
    // Check table is now empty of this record
    await page.fill('#app-search', testCompanyName);
    await page.waitForTimeout(500);
    await expect(tableBody).not.toContainText(testCompanyName);
  });

  test('Test Case 5: Banks & BFR Update', async ({ page }) => {
    await login(page, adminEmail, adminPassword);
    
    // Go to Banks page
    await page.click('[data-page="banks"]');
    await expect(page.locator('#topbar-title')).toContainText('Banks & BFR');

    // Locate first bank edit button
    const firstRow = page.locator('#banks-table-container table tbody tr').first();
    const bankName = await firstRow.locator('td').first().textContent();
    
    // Click edit
    await firstRow.locator('button[title="Edit Bank"]').click();
    await expect(page.locator('#modal-bank-title')).toContainText('Edit Bank');

    // Modify current BFR
    const newBfr = '6.95';
    await page.fill('#bank-form input[name="bfr_current"]', newBfr);
    await page.click('#btn-save-bank');
    
    // Verify toast & table update
    await expect(page.getByText('Bank updated successfully')).toBeVisible();
    // Use compound filter: bank name AND new BFR value — avoids strict mode violation
    // from duplicate bank name entries with different casings (e.g. 'MAYBANK' vs 'Maybank')
    const updatedRow = page.locator('#banks-table-container table tbody tr')
      .filter({ hasText: bankName.trim() })
      .filter({ hasText: newBfr + '%' });
    await expect(updatedRow).toContainText(newBfr);
  });

  test('Test Case 6: Bos Review Flow', async ({ page }) => {
    await login(page, adminEmail, adminPassword);
    
    // Go to HOD Review
    await page.click('[data-page="bos_review"]');
    await expect(page.locator('#topbar-title')).toContainText('HOD Review');

    // Look for proposals
    const firstProposalCard = page.locator('.bos-grid .card').first();
    if (await firstProposalCard.count() > 0) {
      const originalStatus = await firstProposalCard.locator('.badge').textContent();
      
      // Toggle / change status if pending
      if (originalStatus.includes('PENDING')) {
        await firstProposalCard.locator('button.btn-primary', { hasText: 'Approve' }).click();
        await page.click('#confirm-yes');
        await expect(page.getByText('Proposal APPROVED')).toBeVisible();
      }
    }
  });

  test('Test Case 7: RBAC Configuration (Super Admin view)', async ({ page }) => {
    await login(page, adminEmail, adminPassword);
    
    // Ensure Auth.profile is fully loaded (isSuperAdmin() depends on it)
    // before navigating to Settings, otherwise admin sections won't render
    await expect(page.locator('#sidebar-user-role')).toContainText('Super Admin');

    // Navigate to Settings
    await page.click('[data-page="settings"]');
    await expect(page.locator('#topbar-title')).toContainText('Settings');

    // Admin sections load asynchronously — wait for the first one before asserting all
    await expect(page.locator('#admin-user-list')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#admin-page-permissions')).toBeVisible();
    await expect(page.locator('#admin-chart-visibility')).toBeVisible();
  });

  test('Test Case 8: RBAC Verification (Staff view and limits)', async ({ page }) => {
    // 1. Log in as Super Admin first to set a known block configuration
    await login(page, adminEmail, adminPassword);
    // Ensure Auth.profile is fully loaded before navigating to Settings
    await expect(page.locator('#sidebar-user-role')).toContainText('Super Admin');
    await page.click('[data-page="settings"]');
    
    // Wait for admin panel to fully load before interacting (async, same as TC7)
    await expect(page.locator('#admin-page-permissions')).toBeVisible({ timeout: 15000 });

    // Locate the Reports page toggle in Page Access Control
    // Let's toggle Reports to "Blocked" if it's currently allowed
    const reportsRow = page.locator('#admin-page-permissions .admin-row', { hasText: 'Reports' });
    const reportsToggle = reportsRow.locator('.toggle-input');
    
    // Click the visible .toggle-switch label (NOT the hidden input) so the
    // change event fires properly — which triggers DB.updatePagePermission
    // and clears the _pagePermissions cache
    const reportsToggleLabel = reportsRow.locator('.toggle-switch');
    const isAllowed = await reportsToggle.isChecked();
    if (isAllowed) {
      await reportsToggleLabel.click();
      await page.waitForTimeout(1000); // Let Supabase update + cache clear complete
    }

    // Logout
    await page.click('#btn-logout');
    await page.waitForURL('**/pages/login.html**');

    // 2. Log in as Staff
    await login(page, staffEmail, staffPassword);
    
    // Verify Staff role label on side bar
    await expect(page.locator('#sidebar-user-role')).toContainText('Staff');

    // Try navigating to the Reports page
    await page.click('[data-page="reports"]');
    
    // Verify redirected / shown "UNDER DEVELOPMENT" overlay
    const unfinishedPage = page.locator('.unfinished-page');
    await expect(unfinishedPage).toBeVisible();
    await expect(unfinishedPage.locator('.badge')).toContainText('UNDER DEVELOPMENT');

    // Verify Settings page is also blocked for Staff (is_allowed: false in DB)
    await page.click('[data-page="settings"]');
    const settingsUnfinished = page.locator('.unfinished-page');
    await expect(settingsUnfinished).toBeVisible();
    await expect(settingsUnfinished.locator('.badge')).toContainText('UNDER DEVELOPMENT');
    // Admin sections must not be rendered at all since page is blocked
    await expect(page.locator('#admin-user-list')).not.toBeAttached();
    await expect(page.locator('#admin-page-permissions')).not.toBeAttached();
    
    // Clean up: log back in as admin and re-enable Reports page access
    await page.click('#btn-logout');
    await page.waitForURL('**/pages/login.html**');
    await login(page, adminEmail, adminPassword);
    // Ensure Auth.profile is fully loaded before navigating to Settings
    await expect(page.locator('#sidebar-user-role')).toContainText('Super Admin');
    await page.click('[data-page="settings"]');
    // Wait for admin panel to fully load before interacting (async load)
    await expect(page.locator('#admin-page-permissions')).toBeVisible({ timeout: 15000 });
    const reportsToggleRestore = page.locator('#admin-page-permissions .admin-row', { hasText: 'Reports' }).locator('.toggle-input');
    const reportsToggleLabelRestore = page.locator('#admin-page-permissions .admin-row', { hasText: 'Reports' }).locator('.toggle-switch');
    if (!(await reportsToggleRestore.isChecked())) {
      await reportsToggleLabelRestore.click();
      await page.waitForTimeout(1000); // Let Supabase update + cache clear complete
    }
  });

});
