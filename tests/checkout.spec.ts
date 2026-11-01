import { type Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

// CheckoutPage uses the stable field IDs documented in exploration because
// the app's visible checkout labels are not associated with their inputs.
async function openCheckoutThroughCart(page: Page) {
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await cartPage.addProduct('USB-C Hub 7-in-1');
  await cartPage.openCart();
  await expect(cartPage.cartHeading).toBeVisible();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

  // This real UI path is blocked: the button currently does not navigate.
  // These cases cannot reach their checkout assertions until this blocker is
  // fixed. They do not bypass the cart or silently skip the checkout step;
  // after the blocker is fixed, each case still verifies its own regression.
  await expect(checkoutPage.checkoutHeading).toBeVisible();

  return checkoutPage;
}

test.describe('Checkout', () => {
  test('[TC-CHECKOUT-008] Checkout rejects an expired card [REGRESSION]', async ({ page }) => {
    const checkoutPage = await openCheckoutThroughCart(page);
    await checkoutPage.fillValidDetails();
    await checkoutPage.expiryInput.fill('01/20');
    await checkoutPage.placeOrderButton.click();

    await expect(checkoutPage.confirmationHeading).toBeHidden();
    await expect(checkoutPage.toast).toBeVisible();
    await expect(checkoutPage.toast).toHaveText(/\S+/);
  });

  test('[TC-CHECKOUT-011] Checkout rejects letters or symbols in the CVV [REGRESSION]', async ({ page }) => {
    const checkoutPage = await openCheckoutThroughCart(page);
    await checkoutPage.fillValidDetails();
    await checkoutPage.cvvInput.fill('a#3');
    await checkoutPage.placeOrderButton.click();

    await expect(checkoutPage.confirmationHeading).toBeHidden();
    await expect(checkoutPage.toast).toBeVisible();
    await expect(checkoutPage.toast).toHaveText(/\S+/);
  });

  test('[TC-CHECKOUT-004] Checkout rejects an empty form [REGRESSION]', async ({ page }) => {
    const checkoutPage = await openCheckoutThroughCart(page);
    await checkoutPage.placeOrderButton.click();

    await expect(checkoutPage.confirmationHeading).toBeHidden();
    await expect(checkoutPage.toast).toBeVisible();
    await expect(checkoutPage.toast).toHaveText(/\S+/);
  });

  test('[TC-CHECKOUT-001] Order confirmation includes an order reference [REGRESSION]', async ({ page }) => {
    const checkoutPage = await openCheckoutThroughCart(page);
    await checkoutPage.fillValidDetails();
    await checkoutPage.placeOrderButton.click();

    await expect(checkoutPage.confirmationHeading).toBeVisible();
    await expect(checkoutPage.orderReference).toBeVisible();
  });
});
