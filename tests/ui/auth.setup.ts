import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { users } from '../../src/data/users.data';
import { STORAGE_STATE_PATH } from '../../src/data/storage-state';

// Logs in once via the UI and persists storageState so every spec starts
// already authenticated, matching how the app is actually used after day one.
setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await page.waitForURL('**/inventory.html');
  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
