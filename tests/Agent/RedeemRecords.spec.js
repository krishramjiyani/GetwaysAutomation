import { test, expect } from '@playwright/test';

test('End-to-End Redeem flow (Player Redeem -> Verify in Agent Redeem Records)', async ({ page }) => {

    // ==== STEP 1: Player Login ====
    await page.goto('https://skynbliss.co/login', { timeout: 120000 });
      await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(page.locator('h6')).toHaveText('Sign in to your Account');
      await page.locator('input[name="password"]').fill('Test@123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveTitle(/Getways/i);
       await page.getByText('Recharge your account').waitFor({ state: 'visible' });
       await page.getByRole('button', { name: /Redeem/i }).click();
      // ==== STEP 2: Player Redeem Request ====
      const selectedAmount = page.locator("//button[.//p[normalize-space()='50']]");
      await expect(selectedAmount).toHaveClass(/MuiButtonBase-root/); 
      await page.locator('//input[@type="text" and @aria-invalid="false"]').fill('Test redeem for automation');
      await page.getByRole('button', { name: /Redeem Request/i }).click();
      await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();

      // ==== STEP 3: Logout Player ====
      await page.locator('//img[@alt="Account"]').click();
      await page.getByText('Logout', { exact: true }).click();
      await expect(page).toHaveURL(/login/);

        // ==== STEP 4: Agent Login ====
        await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.locator('h6')).toHaveText('Sign in to your Account');
        await page.locator('input[name="password"]').fill('Agent@123');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveTitle(/Getways/i);

        // ==== STEP 5: Navigate to Redeem Records ====
        await page.getByText('Redeem Records', { exact: true }).click();
        // Verify Redeem Records page container is visible
        await expect(page.locator("//div[@class='MuiBox-root css-1pccdic']")).toBeVisible({ timeout: 30000 });

      // ==== STEP 6: Filter by Transaction Amount & Verify ====
      const filterButton = page.getByRole('button', { name: 'Filter' });
      await filterButton.click();

      await page.locator('div[role="combobox"]', { hasText: 'Account' }).click();

      await page.getByRole('option', { name: 'Redeem' }).click();

      const applyButton = page.getByRole('button', { name: 'Apply' });
      await applyButton.click();

      const transactionAmount = page.locator('//input[@placeholder="TransactionAmount"]');
      await transactionAmount.fill('50');
      await page.keyboard.press('Enter');

      // Verify row with 50 exists
      const resultRow = page.locator('//tbody/tr[td[contains(.,"50")]]').first();
      await expect(resultRow).toBeVisible({ timeout: 30000 });

      console.log('✅ Redeem flow verified: Player redeem of 50 found in Agent Redeem Records.');
});
