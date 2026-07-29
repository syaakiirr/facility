// Add this to your existing playwright.config.js — merge into your current
// `use` block rather than replacing the whole config.
//
// playwright-lighthouse needs to talk to Chrome over the DevTools Protocol,
// so Chrome must be launched with a remote debugging port open. Without
// this flag, runLighthouseAudit() will fail to connect.

module.exports = {
  // ...your existing config (testDir, projects, etc.)...
  use: {
    // ...your existing use options (baseURL, etc.)...
    launchOptions: {
      args: ['--remote-debugging-port=9222'],
    },
  },
};
