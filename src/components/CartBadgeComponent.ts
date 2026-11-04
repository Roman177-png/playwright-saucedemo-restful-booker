import type { Locator, Page } from '@playwright/test';

/** Shopping cart badge shown in the header; absent from the DOM when the cart is empty. */
export class CartBadgeComponent {
  private readonly badge: Locator;

  constructor(page: Page) {
    this.badge = page.getByTestId('shopping-cart-badge');
  }

  get locator(): Locator {
    return this.badge;
  }

  async getCount(): Promise<number> {
    if (!(await this.badge.isVisible())) {
      return 0;
    }
    return Number(await this.badge.textContent());
  }
}
