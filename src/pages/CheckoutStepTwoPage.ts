import type { Locator, Page } from '@playwright/test';

export class CheckoutStepTwoPage {
  private readonly finishButton: Locator;
  private readonly totalLabel: Locator;
  private readonly subtotalLabel: Locator;

  constructor(page: Page) {
    this.finishButton = page.getByTestId('finish');
    this.totalLabel = page.getByTestId('total-label');
    this.subtotalLabel = page.getByTestId('subtotal-label');
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent();
    return Number(text?.replace('Item total: $', ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    return Number(text?.replace('Total: $', ''));
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
