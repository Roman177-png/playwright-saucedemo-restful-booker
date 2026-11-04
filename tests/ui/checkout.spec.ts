import { test, expect } from '../../src/fixtures/ui.fixtures';

const BACKPACK = 'sauce-labs-backpack';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addProductToCart(BACKPACK);
    await inventoryPage.header.openCart();
  });

  test('completes a full purchase end to end @smoke', async ({
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await cartPage.checkout();

    await checkoutStepOnePage.fillInfo({ firstName: 'Jane', lastName: 'Doe', postalCode: '90210' });
    await checkoutStepOnePage.continueToOverview();

    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const total = await checkoutStepTwoPage.getTotal();
    expect(total).toBeGreaterThan(subtotal);

    await checkoutStepTwoPage.finish();

    await expect(checkoutCompletePage.getCompleteHeader()).toHaveText('Thank you for your order!');
  });

  test('blocks checkout when required fields are missing @regression', async ({
    cartPage,
    checkoutStepOnePage,
  }) => {
    await cartPage.checkout();

    await checkoutStepOnePage.fillInfo({ firstName: '', lastName: 'Doe', postalCode: '90210' });
    await checkoutStepOnePage.continueToOverview();

    await expect(checkoutStepOnePage.getErrorMessage()).toContainText('First Name is required');
  });
});
