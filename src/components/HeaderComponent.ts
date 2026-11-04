import type { Page } from '@playwright/test';
import { CartBadgeComponent } from './CartBadgeComponent';

/** App header shared by every authenticated page: burger menu, logout, cart link. */
export class HeaderComponent {
  readonly cartBadge: CartBadgeComponent;

  constructor(private readonly page: Page) {
    this.cartBadge = new CartBadgeComponent(page);
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
    // URL updates via pushState before the cart view renders, so wait for its
    // own content instead of racing the route change.
    await this.page.getByTestId('checkout').waitFor();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByTestId('logout-sidebar-link').click();
  }
}
