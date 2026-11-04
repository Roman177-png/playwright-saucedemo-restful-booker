import { test, expect } from '../../src/fixtures/ui.fixtures';

test.describe('Product sorting', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('sorts product names A to Z by default @smoke', async ({ inventoryPage }) => {
    const names = await inventoryPage.getItemNames();

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sorts product names Z to A @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();

    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sorts prices low to high @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts prices high to low @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();

    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
