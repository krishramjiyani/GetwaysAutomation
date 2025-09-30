import { test, expect } from '@playwright/test';

const login = async (page) => {
  await page.goto('https://skynbliss.co/login', { timeout: 120000 });
  await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('input[name="password"]').fill('Agent@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);

};

test.beforeEach(async ({ page }) => {
  await login(page);
});


// test('Verify Summary Records', async ({ page }) => {

//   // ==== STEP 2: Navigate to Summary ====
//   await page.getByText('Summary', { exact: true }).click();

//    // Select start date
//   await page.locator('input[type="date"]').nth(0).fill('2025-09-01');

//   // Select end date
//   await page.locator('input[type="date"]').nth(1).fill('2025-09-30');

//   // Apply filter
//   await page.getByRole('button', { name: 'Apply Filter' }).click();

//   // Assertions
//   await expect(page.getByText('Total User')).toBeVisible();
//   await expect(page.getByText('Total Recharges')).toBeVisible();
//   await expect(page.getByText('Total Redeems')).toBeVisible();
//   await expect(page.getByText('Pending Recharges')).toBeVisible();
//   await expect(page.getByText('Failed Redeems')).toBeVisible();


// });

test('Verify Summary search by username', async ({ page }) => {

  // ==== STEP 2: Navigate to Summary ====
  await page.getByText('Summary', { exact: true }).click();

  // Locate the Username search box
  const usernameInput = page.locator('input[placeholder="Search username"]');

  // Type username
  await usernameInput.fill('TestPlayer');

  // Wait for dropdown option to appear and click it
  const option = page.getByRole('option', { name: 'TestPlayer (Player)' });
  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click();

   // Select start date
  await page.locator('input[type="date"]').nth(0).fill('2025-09-01');

  // Select end date
  await page.locator('input[type="date"]').nth(1).fill('2025-09-30');

  // Apply filter
  await page.getByRole('button', { name: 'Apply Filter' }).click();

  // Validate that the summary cards load
  await expect(page.getByText('Total User')).toBeVisible();
  await expect(page.getByText('Total Recharges')).toBeVisible();
  await expect(page.getByText('Total Redeems')).toBeVisible();
});
