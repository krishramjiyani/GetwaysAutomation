// import { test, expect } from '@playwright/test';

// // Reusable login function
// const login = async (page) => {
//   await page.goto('https://skynbliss.co/login', { timeout: 120000 });
//   await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');   
//   await page.getByRole('button', { name: 'Next' }).click();
//   await expect(page.locator('h6')).toHaveText('Sign in to your Account');
//   await page.locator('input[name="password"]').fill('Test@123');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await expect(page).toHaveTitle(/Getways/i);
//   await page.getByText('Recharge your account').waitFor({ state: 'visible' });
// };

// test.beforeEach(async ({ page }) => {
//   await login(page);
//   await page.getByRole('button', { name: /Redeem/i }).click();
// });

// test('Redeem with 50 and transaction note', async ({ page }) => {
//   const selectedAmount = page.locator("//button[.//p[normalize-space()='50']]");

//   await expect(selectedAmount).toHaveClass(/MuiButtonBase-root/); 

//   await page.locator('//input[@type="text" and @aria-invalid="false"]').fill('Test redeem for automation');
//   await page.getByRole('button', { name: /Redeem Request/i }).click();
//   await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
// });

// test('Redeem with 100 and transaction note', async ({ page }) => {
//   await page.getByLabel('Add Transaction Note').fill('Redeeming 100 via automation test');
//   await page.getByText('100', { exact: true }).click();
//   await page.getByRole('button', { name: /Redeem Request/i }).click();
//   await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
// });

// test('Redeem with 20 and transaction note', async ({ page }) => {
//   await page.getByLabel('Add Transaction Note').fill('Redeeming 20 via automation test');
//   await page.getByText('20', { exact: true }).click();
//   await page.getByRole('button', { name: /Redeem Request/i }).click();
//   await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
// });

// test('Redeem with 200 and transaction note', async ({ page }) => {
//   await page.getByLabel('Add Transaction Note').fill('Redeeming 200 via automation test');
//   await page.getByText('200', { exact: true }).click();
//   await page.getByRole('button', { name: /Redeem Request/i }).click();
//   await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
// });

// test('Redeem with 500 and transaction note', async ({ page }) => {
//   await page.getByLabel('Add Transaction Note').fill('Redeeming 500 via automation test');
//   await page.getByText('500', { exact: true }).click();
//   await page.getByRole('button', { name: /Redeem Request/i }).click();
//   await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
// });

import { test, expect } from '@playwright/test';

// Reusable login function
const login = async (page) => {
  await page.goto('https://skynbliss.co/login', { timeout: 120000 });
  await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('h6')).toHaveText('Sign in to your Account');
  await page.locator('input[name="password"]').fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);
  await page.getByText('Recharge your account').waitFor({ state: 'visible' });
};

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: /Redeem/i }).click();
});

// Array of amounts to test
const redeemAmounts = [20, 50, 100, 200, 500];

for (const amount of redeemAmounts) {
  test(`Redeem with ${amount} and transaction note`, async ({ page }) => {
    await page.getByLabel('Add Transaction Note')
      .fill(`Redeeming ${amount} via automation test`);

    if (amount !== 50) {
      // Click on the amount button only if it's NOT the default (50)
      await page.getByText(String(amount), { exact: true }).click();
    } else {
      // 50 is already selected by default → skip clicking
      console.log('Skipping click because 50 is default selected');
    }

    // Submit
    await page.getByRole('button', { name: /Redeem Request/i }).click();
    await expect(
      page.locator("//div[contains(@class,'MuiSnackbarContent-message')]")
    ).toBeVisible({ timeout: 15000 });

  });
}
