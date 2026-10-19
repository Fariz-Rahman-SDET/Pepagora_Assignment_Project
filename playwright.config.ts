import { defineConfig, devices } from '@playwright/test';
import { baseURL } from './src/config/env';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 45_000,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'always' }]],
  outputDir: 'test-results/artifacts',
  use: {
    baseURL,
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
