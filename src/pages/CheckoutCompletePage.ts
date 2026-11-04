import type { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  getCompleteHeader(): Locator {
    return this.completeHeader;
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
