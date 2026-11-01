import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;
  readonly toast: Locator;
  readonly cartHeading: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.locator('.cart-icon');
    this.cartBadge = page.locator('#cart-count');
    this.toast = page.locator('#toast');
    this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
    this.cartTotal = page.locator('#cart-total');
  }

  productCard(name: string) {
    return this.page.locator('.product-card').filter({ hasText: name });
  }

  cartItem(name: string) {
    return this.page.locator('.cart-item').filter({ hasText: name });
  }

  async addProduct(name: string, quantity = 1) {
    const product = this.productCard(name);
    if (quantity !== 1) {
      await product.getByRole('spinbutton').fill(String(quantity));
    }
    await product.getByRole('button', { name: 'Add to Cart' }).click();
  }

  async openCart() {
    await this.cartButton.click();
  }
}
