const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './playtest',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  workers: 1,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'webkit-iphone12',
      use: { ...devices['iPhone 12'] }
    }
  ]
});
