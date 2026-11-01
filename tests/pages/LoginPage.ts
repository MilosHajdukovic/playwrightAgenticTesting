import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly guestButton: Locator;
  readonly loginHeading: Locator;
  readonly productsHeading: Locator;
  readonly toast: Locator;
  readonly navigation: Locator;
  readonly productsNavigation: Locator;
  readonly cartNavigation: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.guestButton = page.getByRole('button', { name: 'Browse as Guest' });
    this.loginHeading = page.getByRole('heading', { name: 'Welcome back' });
    this.productsHeading = page.getByRole('heading', { name: 'Our Products' });
    this.toast = page.locator('#toast');
    this.navigation = page.getByRole('navigation');
    this.productsNavigation = this.navigation.getByText('Products', { exact: true });
    this.cartNavigation = this.navigation.getByText('Cart');
    this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username?: string, password?: string) {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.signInButton.click();
  }

  async browseAsGuest() {
    await this.guestButton.click();
  }

  userIdentity(email: string) {
    return this.page.getByText(email, { exact: true });
  }
}
