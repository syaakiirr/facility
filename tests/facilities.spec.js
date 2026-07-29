const { test: base, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ---------------------------------------------------------------------------
// Env / credentials
// ---------------------------------------------------------------------------
const adminEmail = process.env.TEST_ADMIN_EMAIL;
const adminPassword = process.env.TEST_ADMIN_PASSWORD;
const staffEmail = process.env.TEST_STAFF_EMAIL;
const staffPassword = process.env.TEST_STAFF_PASSWORD;

const AUTH_DIR = path.join(__dirname, '.auth');
const ADMIN_STATE = path.join(AUTH_DIR, 'admin.json');
const STAFF_STATE = path.join(AUTH_DIR, 'staff.json');

function checkCredentials() {
  if (!adminEmail || !adminPassword || !staffEmail || !staffPassword) {
    throw new Error(
      'MISSING CREDENTIALS: Playwright tests require TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, ' +
      'TEST_STAFF_EMAIL, and TEST_STAFF_PASSWORD to be defined in your .env file.'
    );
  }
}

// ---------------------------------------------------------------------------
// Login helper — used only to *create* storage state, not on every test
// ---------------------------------------------------------------------------
async function uiLogin(page, email, password) {
  await page.goto('/pages/login.html');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('#btn-login');
  await page.waitForURL('**/index.html**');
  await expect(page.locator('#sidebar-user-role')).toBeVisible();
}

const STATE_MAX_AGE_MS = 30 * 60 * 1000; // 30 min — adjust to your token TTL

function isStateFresh(statePath) {
  if (!fs.existsSync(statePath)) return false;
  const ageMs = Date.now() - fs.statSync(statePath).mtimeMs;
  return ageMs < STATE_MAX_AGE_MS;
}

async function createStorageState(browser, statePath, email, password) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await uiLogin(page, email, password);
  await context.storageState({ path: statePath });
  await context.close();
}

async function ensureStorageState(browser, statePath, email, password) {
  if (!isStateFresh(statePath)) {
    await createStorageState(browser, statePath, email, password);
  }
}

// Opens /index.html with the given storageState and self-heals if the
// cached session turned out to be expired/invalid (app redirects back to
// login.html).
async function openAuthenticated(browser, statePath, email, password) {
  await ensureStorageState(browser, statePath, email, password);
  let context = await browser.newContext({ storageState: statePath });
  let page = await context.newPage();
  await page.goto('/index.html');

  const stillOnLogin = await page
    .waitForURL('**/pages/login.html**', { timeout: 3000 })
    .then(() => true)
    .catch(() => false);

  if (stillOnLogin) {
    await context.close();
    await createStorageState(browser, statePath, email, password);
    context = await browser.newContext({ storageState: statePath });
    page = await context.newPage();
    await page.goto('/index.html');
  }

  await expect(page.locator('#topbar-title')).toBeVisible({ timeout: 10000 });
  return { context, page };
}

// ---------------------------------------------------------------------------
// Fixtures: adminPage / staffPage come pre-authenticated via storageState
// ---------------------------------------------------------------------------
const test = base.extend({
  adminPage: async ({ browser }, use) => {
    const { context, page } = await openAuthenticated(browser, ADMIN_STATE, adminEmail, adminPassword);
    await use(page);
    await context.close();
  },
  staffPage: async ({ browser }, use) => {
    const { context, page } = await openAuthenticated(browser, STAFF_STATE, staffEmail, staffPassword);
    await use(page);
    await context.close();
  },
});

test.beforeAll(() => {
  checkCredentials();
});

// ---------------------------------------------------------------------------
// Stateless tests — safe to run in parallel
// ---------------------------------------------------------------------------
test.describe('Kak Effa Facilities Dashboard — Auth & Read-only', () => {

  test('TC1: Authentication failures & UI', async ({ page }) => {
    await page.goto('/pages/login.html');

    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('.login-logo-text')).toContainText('Kak Effa');

    await page.fill('#email', 'wronguser@test.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#btn-login');

    const errorBox = page.locator('#error-box');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(/Incorrect email or password|Invalid login credentials/);
  });

  test('TC2: Successful login & dashboard KPI check', async ({ adminPage: page }) => {
    await expect(page.locator('#topbar-title')).toContainText('Dashboard');
    await expect(page.locator('#user-name')).toContainText(adminEmail);
    await expect(page.locator('#sidebar-user-role')).toContainText('Super Admin');

    for (const kpi of ['#kpi-total', '#kpi-done', '#kpi-progress', '#kpi-requested', '#kpi-approved']) {
      await expect(page.locator(kpi)).toBeVisible();
    }
  });

  test('TC3: Navigation via sidebar', async ({ adminPage: page }) => {
    const pages = ['applications', 'companies', 'banks', 'reports', 'bos_review', 'settings'];

    for (const pageKey of pages) {
      await test.step(`navigate to ${pageKey}`, async () => {
        await page.click(`[data-page="${pageKey}"]`);
        const expectedTitle = pageKey === 'bos_review'
          ? /hod review|bos review/i
          : new RegExp(pageKey.replace('_', ' '), 'i');
        await expect(page.locator('#topbar-title')).toContainText(expectedTitle);
      });
    }
  });

});

// ---------------------------------------------------------------------------
// Stateful tests — these mutate shared DB rows (banks, permissions, apps).
// Running them in parallel with each other (or with a re-run of TC8) risks
// races on the same rows, so keep this group serial.
// ---------------------------------------------------------------------------
test.describe('Kak Effa Facilities Dashboard — Mutating flows', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC4: Applications CRUD operations', async ({ adminPage: page }) => {
    await page.click('[data-page="applications"]');
    await expect(page.locator('#topbar-title')).toContainText('Applications');

    const existingCompany = 'MUAZ FORCE SDN BHD';
    const uniqueFacilityName = `Test Facility ${Date.now()}`;
    const tableBody = page.locator('#apps-table-container table tbody');
    const newRow = () => tableBody.locator('tr', { hasText: uniqueFacilityName });

    try {
      await test.step('create', async () => {
        await page.click('#btn-add-app');
        await expect(page.locator('#modal-app-title')).toContainText('New Application');

        await page.selectOption('#app-form select[name="category"]', 'COMPANY');
        await page.selectOption('#app-form select[name="company"]', { label: existingCompany });
        await page.fill('#app-form input[name="year_application"]', '2026');
        await page.selectOption('#app-form select[name="bank"]', 'BSN');
        await page.selectOption('#app-form select[name="type_facility"]', 'TERM LOAN');
        await page.fill('#app-form input[name="name_facility"]', uniqueFacilityName);
        await page.selectOption('#app-form select[name="collateral_id"]', { label: 'FD' });
        await page.fill('#app-form input[name="profit_rate"]', '5.5%');
        await page.fill('#app-form input[name="rate_tenure"]', '5 YEARS');
        await page.selectOption('#app-form select[name="status"]', 'PENDING');
        await page.fill('#app-form input[name="total_requested"]', '500000');
        await page.fill('#app-form input[name="total_approved"]', '0');
        await page.fill('#app-form textarea[name="notes"]', 'E2E testing notes here.');

        await page.click('#btn-save-app');
        await expect(page.getByText('Application added successfully')).toBeVisible();
      });

      await test.step('read & search', async () => {
        await page.fill('#app-search', existingCompany);
        await expect(newRow()).toBeVisible({ timeout: 5000 });
      });

      await test.step('update', async () => {
        await newRow().locator('button[title="Edit"]').click();
        await expect(page.locator('#modal-app-title')).toContainText('Edit Application');

        await page.fill('#app-form input[name="total_approved"]', '450000');
        await page.selectOption('#app-form select[name="status"]', 'IN FORCE');
        await page.click('#btn-save-app');

        await expect(page.getByText('Application updated successfully')).toBeVisible();
        await expect(newRow()).toContainText('IN FORCE', { timeout: 5000 });
      });
    } finally {
      await test.step('cleanup: delete test row', async () => {
        await page.fill('#app-search', existingCompany);
        const row = newRow();
        if (await row.count() > 0) {
          await row.locator('button[title="Delete"]').click();
          await page.click('#confirm-yes');
          await expect(page.getByText('Application deleted successfully')).toBeVisible();
        }
      });
    }

    await page.fill('#app-search', existingCompany);
    await expect(newRow()).toHaveCount(0);
  });

  test('TC5: Banks & BFR update', async ({ adminPage: page }) => {
    await page.click('[data-page="banks"]');
    await expect(page.locator('#topbar-title')).toContainText('Banks & BFR');

    const firstRow = page.locator('#banks-table-container table tbody tr').first();
    const bankName = (await firstRow.locator('td').first().textContent() || '').trim();
    const originalBfrText = await firstRow.locator('td', { hasText: '%' }).first().textContent();

    await firstRow.locator('button[title="Edit Bank"]').click();
    await expect(page.locator('#modal-bank-title')).toContainText('Edit Bank');

    const newBfr = '6.95';
    try {
      await page.fill('#bank-form input[name="bfr_current"]', newBfr);
      await page.click('#btn-save-bank');

      await expect(page.getByText('Bank updated successfully')).toBeVisible();

      const updatedRow = page.locator('#banks-table-container table tbody tr')
        .filter({ hasText: bankName })
        .filter({ hasText: newBfr + '%' });
      await expect(updatedRow).toContainText(newBfr);
    } finally {
      if (originalBfrText && !originalBfrText.includes(newBfr)) {
        const rowNow = page.locator('#banks-table-container table tbody tr').filter({ hasText: bankName });
        await rowNow.locator('button[title="Edit Bank"]').click();
        const originalValue = originalBfrText.replace('%', '').trim();
        await page.fill('#bank-form input[name="bfr_current"]', originalValue);
        await page.click('#btn-save-bank');
        await expect(page.getByText('Bank updated successfully')).toBeVisible();
      }
    }
  });

  test('TC6: BOS review flow', async ({ adminPage: page }) => {
    const uniqueFacilityName = `Test BOS Review ${Date.now()}`;

    await page.click('[data-page="applications"]');
    await page.click('#btn-add-app');
    await page.selectOption('#app-form select[name="category"]', 'COMPANY');
    await page.selectOption('#app-form select[name="company"]', { label: 'MUAZ FORCE SDN BHD' });
    await page.fill('#app-form input[name="year_application"]', '2026');
    await page.selectOption('#app-form select[name="bank"]', 'BSN');
    await page.selectOption('#app-form select[name="type_facility"]', 'TERM LOAN');
    await page.fill('#app-form input[name="name_facility"]', uniqueFacilityName);
    await page.selectOption('#app-form select[name="collateral_id"]', { label: 'FD' });
    await page.fill('#app-form input[name="profit_rate"]', '5.5%');
    await page.fill('#app-form input[name="rate_tenure"]', '5 YEARS');
    await page.selectOption('#app-form select[name="status"]', 'REVIEW BY HOD');
    await page.fill('#app-form input[name="total_requested"]', '250000');
    await page.fill('#app-form input[name="total_approved"]', '0');
    await page.fill('#app-form textarea[name="notes"]', 'Seeded for TC6 BOS review');
    await page.click('#btn-save-app');
    await expect(page.getByText('Application added successfully')).toBeVisible();

    await page.click('[data-page="bos_review"]');
    await expect(page.locator('#topbar-title')).toContainText('HOD Review');

    await expect(page.getByText('Pending Review', { exact: true })).toBeVisible({ timeout: 10000 });

    const proposalCards = page.locator('button', { hasText: 'Approve' })
      .locator('xpath=ancestor::*[.//text()[contains(., "PENDING REVIEW")]][1]');
    const firstProposalCard = proposalCards.first();
    await expect(firstProposalCard).toBeVisible({ timeout: 10000 });

    const originalStatus = await firstProposalCard.textContent();
    if (originalStatus?.includes('PENDING REVIEW')) {
      await firstProposalCard.getByRole('button', { name: 'Approve' }).click();

      const confirmDialog = page.locator('#confirm-yes');
      const dialogAppeared = await confirmDialog
        .waitFor({ state: 'visible', timeout: 2000 })
        .then(() => true)
        .catch(() => false);
      if (dialogAppeared) {
        await confirmDialog.click();
      }

      await expect(page.getByText('Proposal APPROVED')).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC7: RBAC configuration (Super Admin view)', async ({ adminPage: page }) => {
    await expect(page.locator('#sidebar-user-role')).toContainText('Super Admin');

    await page.click('[data-page="settings"]');
    await expect(page.locator('#topbar-title')).toContainText('Settings');

    await expect(page.locator('#admin-user-list')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#admin-page-permissions')).toBeVisible();
    await expect(page.locator('#admin-chart-visibility')).toBeVisible();
  });

  test('TC8: RBAC verification (Staff view and limits)', async ({ adminPage, browser }) => {
    const reportsRow = adminPage.locator('#admin-page-permissions .admin-row', { hasText: 'Reports' });
    const reportsToggleInput = reportsRow.locator('.toggle-input');
    const reportsToggleLabel = reportsRow.locator('.toggle-switch');

    await adminPage.click('[data-page="settings"]');
    await expect(adminPage.locator('#admin-page-permissions')).toBeVisible({ timeout: 15000 });

    const wasAllowed = await reportsToggleInput.isChecked();

    try {
      if (wasAllowed) {
        await reportsToggleLabel.click();
        await expect(reportsToggleInput).not.toBeChecked({ timeout: 5000 });
      }

      const { context: staffContext, page: staffPage } =
        await openAuthenticated(browser, STAFF_STATE, staffEmail, staffPassword);

      await expect(staffPage.locator('#sidebar-user-role')).toContainText('Staff');

      await staffPage.click('[data-page="reports"]');
      const unfinishedPage = staffPage.locator('.unfinished-page');
      await expect(unfinishedPage).toBeVisible();
      await expect(unfinishedPage.locator('.badge')).toContainText('UNDER DEVELOPMENT');

      await staffPage.click('[data-page="settings"]');
      const settingsUnfinished = staffPage.locator('.unfinished-page');
      await expect(settingsUnfinished).toBeVisible();
      await expect(settingsUnfinished.locator('.badge')).toContainText('UNDER DEVELOPMENT');
      await expect(staffPage.locator('#admin-user-list')).not.toBeAttached();
      await expect(staffPage.locator('#admin-page-permissions')).not.toBeAttached();

      await staffContext.close();
    } finally {
      if (wasAllowed && !(await reportsToggleInput.isChecked())) {
        await reportsToggleLabel.click();
        await expect(reportsToggleInput).toBeChecked({ timeout: 5000 });
      }
    }
  });

});