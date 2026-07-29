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
// login.html). This is what actually fixes "element(s) not found" errors
// on dashboard locators when a stale .auth/*.json is reused across runs.
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
    // Cached session was stale — force a fresh login and retry once.
    await createStorageState(browser, statePath, email, password);
    context = await browser.newContext({ storageState: statePath });
    page = await context.newPage();
    await page.goto('/index.html');
  }

  await expect(page.locator('#topbar-title')).toBeVisible({ timeout: 10000 });
  return { context, page };
}

// ---------------------------------------------------------------------------
// Fixtures: adminPage / staffPage come pre-authenticated via storageState,
// so each test skips the UI login round-trip (faster + removes a whole
// class of flakiness caused by re-logging-in on every test).
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

module.exports = { test, expect, openAuthenticated, ADMIN_STATE, STAFF_STATE, adminEmail, adminPassword, staffEmail, staffPassword };