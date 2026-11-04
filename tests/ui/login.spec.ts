import { test, expect } from '../../src/fixtures/ui.fixtures';
import { users, invalidLoginCases } from '../../src/data/users.data';

// Login is tested unauthenticated regardless of the project's default storageState.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('standard user can log in and reach the inventory page @smoke', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL('/inventory.html');
  });

  for (const testCase of invalidLoginCases) {
    test(`rejects login with ${testCase.name} @regression`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(testCase.username, testCase.password);

      await expect(loginPage.getErrorMessage()).toContainText(testCase.expectedError);
    });
  }
});
