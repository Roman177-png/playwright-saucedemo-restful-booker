import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly header: HeaderComponent;
  private readonly sortDropdown: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async addProductToCart(slug: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }

  async removeProductFromCart(slug: string): Promise<void> {
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => Number(text.replace('$', '')));
  }
}
