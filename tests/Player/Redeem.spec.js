import {test, expect} from '@playwright/test';

test('Redeem with transaction note', async ({ page }) => {
    
   await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });

    await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('h6')).toHaveText('Sign in to your Account');

    await page.locator('input[name="password"]').fill('Test@123');
    await page.locator('button:has-text("Login")').click();
    await expect(page).toHaveTitle(/Getways/i);

    // await expect(page).toHaveURL('https://skynbliss.co/playerDashboard');

    // Click on "Redeem" tab if not already on it
    await page.getByRole('button', { name: /Redeem/i }).click();

    const selectedAmount = page.getByRole('button', { name: 'AOG Symbol 50', exact: true });
    await expect(selectedAmount).toHaveClass(/css.*MuiButtonBase-root-MuiButton-root/);

    await page.locator('//input[@type="text" and @aria-invalid="false"]').fill('Test redeem for automation');


    await page.getByRole('button', { name: /Redeem Request/i }).click();

  await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();

});
