import { test, expect } from './fixtures/test';

const VALID_EMAIL = process.env.TEST_EMAIL;
const VALID_PASSWORD = process.env.TEST_PASSWORD;

if (!VALID_EMAIL || !VALID_PASSWORD) {
  throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running login tests.');
}

test.describe('Login', () => {
  test.describe('Positive cases', () => {
    test('[TC-LOGIN-001] Valid credentials open the product catalog', async ({ loginPage }) => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

      await expect(loginPage.productsHeading).toBeVisible();
      await expect(loginPage.loginHeading).toBeHidden();
    });

    test('[TC-LOGIN-003] Successful login opens the catalog and navigation [REGRESSION]', async ({ loginPage }) => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

      await expect(loginPage.productsHeading).toBeVisible();
      await expect(loginPage.loginHeading).toBeHidden();
      await expect(loginPage.navigation).toBeVisible();
    });
  });

  test.describe('Negative cases', () => {
    test('[TC-LOGIN-004] Empty credentials are rejected [REGRESSION]', async ({ loginPage }) => {
      await loginPage.signInButton.click();

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(loginPage.productsHeading).toBeHidden();
      await expect(loginPage.usernameError).toBeVisible();
      await expect(loginPage.passwordError).toBeVisible();
    });

    test('[TC-LOGIN-005] Incorrect password is rejected with an error [REGRESSION]', async ({ loginPage }) => {
      await loginPage.login(VALID_EMAIL, 'wrongpassword123');

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(loginPage.productsHeading).toBeHidden();
      await expect(loginPage.loginError).toBeVisible();
      await expect(loginPage.loginError).toContainText('Invalid username or password');
    });

    test('[TC-LOGIN-006] Username without email format is rejected [REGRESSION]', async ({ loginPage }) => {
      await loginPage.login('admin', VALID_PASSWORD);

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(loginPage.productsHeading).toBeHidden();
      await expect(loginPage.loginError).toBeVisible();
    });

    test('[TC-LOGIN-007] Email without a domain is rejected [REGRESSION]', async ({ loginPage }) => {
      await loginPage.login('demo@techshop', VALID_PASSWORD);

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(loginPage.productsHeading).toBeHidden();
      await expect(loginPage.loginError).toBeVisible();
    });

    test('[TC-LOGIN-013] Missing password is rejected [REGRESSION]', async ({ loginPage }) => {
      await loginPage.login(VALID_EMAIL, '');

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(loginPage.productsHeading).toBeHidden();
      await expect(loginPage.passwordError).toBeVisible();
    });

    test('[TC-LOGIN-014] Missing email is rejected [REGRESSION]', async ({ loginPage }) => {
      await loginPage.login('', VALID_PASSWORD);

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(loginPage.productsHeading).toBeHidden();
      await expect(loginPage.usernameError).toBeVisible();
    });
  });

  test.describe('Edge cases and regressions', () => {
    test('[TC-LOGIN-008] Password characters are masked [REGRESSION]', async ({ loginPage }) => {
      await loginPage.passwordInput.fill(VALID_PASSWORD);

      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('[TC-LOGIN-009] Login session persists after page reload [REGRESSION]', async ({ loginPage, page }) => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
      await expect(loginPage.productsHeading).toBeVisible();

      await page.reload();

      await expect(loginPage.productsHeading).toBeVisible();
      await expect(loginPage.loginHeading).toBeHidden();
    });

    test('[TC-LOGIN-010] Whitespace-only credentials are rejected', async ({ loginPage }) => {
      await loginPage.login('   ', '   ');

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(loginPage.productsHeading).toBeHidden();
      await expect(loginPage.usernameError).toBeVisible();
    });

    test('[TC-LOGIN-011] Login page has a meaningful browser title [REGRESSION]', async ({ loginPage }) => {
      await expect(loginPage.page).toHaveTitle(/TechShop/i);
    });

    test('[TC-LOGIN-012] Product and Cart navigation is unavailable before login [REGRESSION]', async ({ loginPage }) => {
      await expect(loginPage.productsNavigation).toBeHidden();
      await expect(loginPage.cartNavigation).toBeHidden();
    });
  });
});
