import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutHeading: Locator;
  readonly placeOrderButton: Locator;
  readonly toast: Locator;
  readonly confirmationHeading: Locator;
  readonly orderReference: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvvInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutHeading = page.getByRole('heading', { name: 'Checkout' });
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.toast = page.locator('#toast');
    this.confirmationHeading = page.getByRole('heading', { name: 'Order Placed!' });
    this.orderReference = page.getByText(/order reference/i);

    this.firstNameInput = page.locator('#co-firstname');
    this.lastNameInput = page.locator('#co-lastname');
    this.addressInput = page.locator('#co-address');
    this.cityInput = page.locator('#co-city');
    this.zipCodeInput = page.locator('#co-zip');
    this.emailInput = page.locator('#co-email');
    this.phoneInput = page.locator('#co-phone');
    this.cardNumberInput = page.locator('#co-card');
    this.expiryInput = page.locator('#co-expiry');
    this.cvvInput = page.locator('#co-cvv');
  }

  async fillValidDetails() {
    const now = new Date();
    const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
    const expiryYear = String(now.getFullYear()).slice(-2);

    await this.firstNameInput.fill('Alex');
    await this.lastNameInput.fill('Tester');
    await this.addressInput.fill('123 Main Street');
    await this.cityInput.fill('New York');
    await this.zipCodeInput.fill('10001');
    await this.emailInput.fill('alex@example.com');
    await this.phoneInput.fill('5550101234');
    await this.cardNumberInput.fill('1234567890123456');
    await this.expiryInput.fill(`${expiryMonth}/${expiryYear}`);
    await this.cvvInput.fill('123');
  }
}
