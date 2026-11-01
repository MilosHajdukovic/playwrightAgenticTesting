import { type Page, test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type AuthenticatedFixtures = {
  page: Page;
};

export const test = base.extend<AuthenticatedFixtures>({
  page: async ({ page: basePage }, use) => {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running authenticated tests.');
    }

    const loginPage = new LoginPage(basePage);
    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(loginPage.productsHeading).toBeVisible();

    await use(basePage);
  },
});

export { expect };
