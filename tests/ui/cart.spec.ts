import { test, expect } from '../../src/fixtures/ui.fixtures';

const BACKPACK = 'sauce-labs-backpack';
const BIKE_LIGHT = 'sauce-labs-bike-light';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding a product updates the cart badge @smoke', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(BACKPACK);

    await expect(inventoryPage.header.cartBadge.locator).toHaveText('1');
  });

  test('adding multiple products accumulates the badge count @regression', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart(BACKPACK);
    await inventoryPage.addProductToCart(BIKE_LIGHT);

    await expect(inventoryPage.header.cartBadge.locator).toHaveText('2');
  });

  test('removing the only item in the cart clears the badge @regression', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart(BACKPACK);
    await inventoryPage.removeProductFromCart(BACKPACK);

    expect(await inventoryPage.header.cartBadge.getCount()).toBe(0);
  });

  test('cart page lists every added product @regression', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart(BACKPACK);
    await inventoryPage.addProductToCart(BIKE_LIGHT);
    await inventoryPage.header.openCart();

    const names = await cartPage.getItemNames();
    expect(names).toHaveLength(2);
  });
});
