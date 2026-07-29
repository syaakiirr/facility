const { test: base } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { runLighthouseAudit } = require('./lighthouse.helper');

// ---------------------------------------------------------------------------
// Reuse the same authenticated-session pattern as dashboard.spec.js so we
// don't have to log in via the UI for every audit. If you already have
// adminPage/staffPage fixtures defined elsewhere (e.g. in a shared
// fixtures file), import `test` from there instead of redefining this here.
// ---------------------------------------------------------------------------
const adminEmail = process.env.TEST_ADMIN_EMAIL;
const adminPassword = process.env.TEST_ADMIN_PASSWORD;

const AUTH_DIR = path.join(__dirname, '.auth');
const ADMIN_STATE = path.join(AUTH_DIR, 'admin.json');
const STATE_MAX_AGE_MS = 30 * 60 * 1000; // 30 min — match your token TTL

function isStateFresh(statePath) {
  if (!fs.existsSync(statePath)) return false;
  return Date.now() - fs.statSync(statePath).mtimeMs < STATE_MAX_AGE_MS;
}

async function createStorageState(browser, statePath, email, password) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/pages/login.html');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('#btn-login');
  await page.waitForURL('**/index.html**');
  await context.storageState({ path: statePath });
  await context.close();
}

const test = base.extend({
  adminPage: async ({ browser }, use) => {
    if (!isStateFresh(ADMIN_STATE)) {
      await createStorageState(browser, ADMIN_STATE, adminEmail, adminPassword);
    }
    const context = await browser.newContext({ storageState: ADMIN_STATE });
    const page = await context.newPage();
    await page.goto('/index.html');
    await use(page);
    await context.close();
  },
});

// ---------------------------------------------------------------------------
// Pages to audit. `key` matches the [data-page="..."] sidebar attribute;
// `key: null` means "already on this page after login" (Dashboard).
// Adjust thresholds per page once you have a real baseline — a heavy
// data table page (Applications) may legitimately score lower than a
// mostly-static one (Settings) without that being a regression.
// ---------------------------------------------------------------------------
const pagesToAudit = [
  { key: null, name: 'dashboard', label: 'Dashboard' },
  { key: 'applications', name: 'applications', label: 'Applications' },
  { key: 'companies', name: 'companies', label: 'Companies' },
  { key: 'banks', name: 'banks', label: 'Banks & BFR' },
  { key: 'reports', name: 'reports', label: 'Reports' },
  { key: 'bos_review', name: 'bos_review', label: 'HOD Review' },
  { key: 'settings', name: 'settings', label: 'Settings' },
];

test.describe('Performance audits — authenticated pages', () => {
  // All audits share one Chrome remote-debugging port (see
  // playwright.config.js), so they must run one at a time, not in parallel.
  test.describe.configure({ mode: 'serial' });

  for (const { key, name, label } of pagesToAudit) {
    test(`Lighthouse: ${label}`, async ({ adminPage: page }) => {
      if (key) {
        await page.click(`[data-page="${key}"]`);
        await page.waitForLoadState('networkidle');
      }

      await runLighthouseAudit(page, name, {
        // Start lenient; tighten as you optimize each page. A heavier
        // page like Applications (big table) may need a lower bar than
        // a lighter one like Settings — don't force one number for all.
        performance: 40,
      });
    });
  }
});
