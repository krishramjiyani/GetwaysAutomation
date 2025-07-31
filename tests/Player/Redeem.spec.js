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

test('Redeem with 50 and transaction note', async ({ page }) => {
  const selectedAmount = page.getByRole('button', { name: 'Symbol 50', exact: true });
  await expect(selectedAmount).toHaveClass(/css.*MuiButtonBase-root-MuiButton-root/);
  await page.locator('//input[@type="text" and @aria-invalid="false"]').fill('Test redeem for automation');
  await page.getByRole('button', { name: /Redeem Request/i }).click();
  await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
});

test('Redeem with 100 and transaction note', async ({ page }) => {
  await page.getByLabel('Add Transaction Note').fill('Redeeming 100 via automation test');
  await page.getByText('100', { exact: true }).click();
  await page.getByRole('button', { name: /Redeem Request/i }).click();
  await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
});

test('Redeem with 20 and transaction note', async ({ page }) => {
  await page.getByLabel('Add Transaction Note').fill('Redeeming 20 via automation test');
  await page.getByText('20', { exact: true }).click();
  await page.getByRole('button', { name: /Redeem Request/i }).click();
  await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
});

test('Redeem with 200 and transaction note', async ({ page }) => {
  await page.getByLabel('Add Transaction Note').fill('Redeeming 200 via automation test');
  await page.getByText('200', { exact: true }).click();
  await page.getByRole('button', { name: /Redeem Request/i }).click();
  await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
});

test('Redeem with 500 and transaction note', async ({ page }) => {
  await page.getByLabel('Add Transaction Note').fill('Redeeming 500 via automation test');
  await page.getByText('500', { exact: true }).click();
  await page.getByRole('button', { name: /Redeem Request/i }).click();
  await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();
});
