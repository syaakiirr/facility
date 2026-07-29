const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const AUTH_DIR = path.join(__dirname, '.auth');

setup.describe.configure({ mode: 'serial' });

setup.beforeAll(() => {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
});

async function loginAndStoreState(page, email, password, statePath, label) {
  const failedRequests = [];
  const consoleErrors = [];
  const authResponses = [];

  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('response', (res) => {
    if (/auth|login|signin/i.test(res.url())) {
      authResponses.push(`${res.status()} ${res.url()}`);
    }
  });

  await page.goto('/pages/login.html');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('#btn-login');

  const result = await Promise.race([
    page.waitForURL('**/index.html**', { timeout: 20000 }).then(() => 'success'),
    page.locator('#error-box').waitFor({ state: 'visible', timeout: 20000 }).then(() => 'error'),
  ]).catch(() => 'timeout');

  if (result !== 'success') {
    const errorText = await page.locator('#error-box').textContent().catch(() => null);
    throw new Error(
      `${label} login did not reach dashboard (result: ${result}).\n` +
      `Error box: ${errorText}\n` +
      `Auth responses seen: ${authResponses.join('; ') || 'none — request may never have fired'}\n` +
      `Failed requests: ${failedRequests.join('; ') || 'none'}\n` +
      `Console errors: ${consoleErrors.join('; ') || 'none'}`
    );
  }

  await page.context().storageState({ path: statePath });
}

setup('authenticate as admin', async ({ page }) => {
  await loginAndStoreState(page, process.env.TEST_ADMIN_EMAIL, process.env.TEST_ADMIN_PASSWORD, path.join(AUTH_DIR, 'admin.json'), 'Admin');
});

setup('authenticate as staff', async ({ page }) => {
  await loginAndStoreState(page, process.env.TEST_STAFF_EMAIL, process.env.TEST_STAFF_PASSWORD, path.join(AUTH_DIR, 'staff.json'), 'Staff');
});