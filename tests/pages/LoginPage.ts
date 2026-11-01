import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly loginHeading: Locator;
  readonly productsHeading: Locator;
  readonly loginError: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly navigation: Locator;
  readonly productsNavigation: Locator;
  readonly cartNavigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.loginHeading = page.getByRole('heading', { name: 'Welcome back' });
    this.productsHeading = page.getByRole('heading', { name: 'Our Products' });
    this.loginError = page.locator('#login-error');
    this.usernameError = page.locator('#err-login-user');
    this.passwordError = page.locator('#err-login-pass');
    this.navigation = page.getByRole('navigation');
    this.productsNavigation = this.navigation.getByText('Products', { exact: true });
    this.cartNavigation = this.navigation.getByText('Cart');
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
}
