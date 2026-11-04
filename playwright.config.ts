import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { STORAGE_STATE_PATH } from './src/data/storage-state';

dotenv.config();

const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['blob'], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // SauceDemo exposes hooks as data-test, not Playwright's default data-testid.
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'setup',
      testDir: './tests/ui',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: UI_BASE_URL },
    },
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL, storageState: STORAGE_STATE_PATH },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        baseURL: UI_BASE_URL,
        storageState: STORAGE_STATE_PATH,
      },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Safari'], baseURL: UI_BASE_URL, storageState: STORAGE_STATE_PATH },
    },
  ],
});
