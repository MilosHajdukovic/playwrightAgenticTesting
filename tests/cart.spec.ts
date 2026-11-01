import { test, expect } from './fixtures';
import { CartPage } from './pages/CartPage';

test.describe('Cart', () => {
  test('Adding a product updates the badge and cart contents', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.addProduct('USB-C Hub 7-in-1');

    await expect(cartPage.cartBadge).toHaveText('1');
    await expect(cartPage.toast).toContainText('USB-C Hub 7-in-1 added to cart');

    await cartPage.openCart();

    await expect(cartPage.cartHeading).toBeVisible();
    await expect(cartPage.cartItem('USB-C Hub 7-in-1')).toBeVisible();
    await expect(cartPage.cartItem('USB-C Hub 7-in-1').getByRole('spinbutton')).toHaveValue('1');
  });

  test('[TC-CART-002] Cart applies the advertised discount [REGRESSION]', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.addProduct('Wireless Headphones');
    await cartPage.openCart();

    const headphones = cartPage.cartItem('Wireless Headphones');
    await expect(headphones.getByText('$71.99 each', { exact: true })).toBeVisible();
    await expect(headphones.getByText('$71.99', { exact: true })).toBeVisible();
  });

  test('[TC-CART-004] Cart quantity cannot be reduced below one [REGRESSION]', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.addProduct('USB-C Hub 7-in-1');
    await cartPage.openCart();

    const quantity = cartPage.cartItem('USB-C Hub 7-in-1').getByRole('spinbutton');
    await quantity.fill('-1');
    await quantity.press('Tab');

    await expect(quantity).toHaveValue('1');
  });

  test('[TC-CART-006] Cart totals recalculate when quantity changes [REGRESSION]', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.addProduct('USB-C Hub 7-in-1');
    await cartPage.openCart();

    const usbHub = cartPage.cartItem('USB-C Hub 7-in-1');
    const quantity = usbHub.getByRole('spinbutton');
    await quantity.fill('3');
    await quantity.press('Tab');

    await expect(quantity).toHaveValue('3');
    await expect.soft(usbHub.getByText('$89.22', { exact: true })).toBeVisible();
    await expect.soft(page.locator('#cart-subtotal')).toHaveText('$89.22');
    await expect.soft(cartPage.cartTotal).toHaveText('$94.21');
  });
});
