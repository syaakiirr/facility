const { playAudit } = require('playwright-lighthouse');
const path = require('path');
const fs = require('fs');

const REPORTS_DIR = path.join(__dirname, 'lighthouse-reports');

/**
 * Runs a Lighthouse audit against an already-authenticated Playwright page.
 * Unlike PageSpeed Insights (which can only crawl a public URL and can't
 * log in), this reuses the live authenticated session/page — so it can
 * audit dashboard pages, not just the login screen.
 *
 * @param {import('@playwright/test').Page} page - an authenticated page
 * @param {string} pageName - used for the report filename, e.g. 'dashboard'
 * @param {object} thresholds - override any of performance/accessibility/best-practices/seo (0-100 scale)
 */
async function runLighthouseAudit(page, pageName, thresholds = {}) {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  // Defaults are intentionally lenient — the goal at first is to establish
  // a baseline and catch regressions, not to gate CI on an arbitrary
  // "should be 90+" bar before you've had a chance to optimize anything.
  const defaultThresholds = {
    performance: 50,
    accessibility: 80,
    'best-practices': 80,
    seo: 50,
    ...thresholds,
  };

  await playAudit({
    page,
    thresholds: defaultThresholds,
    reports: {
      formats: { html: true, json: true },
      directory: REPORTS_DIR,
      name: `lighthouse-${pageName}`,
    },
    // playwright-lighthouse talks to the browser over CDP on this port —
    // must match --remote-debugging-port in playwright.config.js launchOptions.
    port: 9222,
  });
}

module.exports = { runLighthouseAudit, REPORTS_DIR };
