import { test, expect } from '@playwright/test';

test('Cashout', async ({ page }) => {

    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });

    await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('h6')).toHaveText('Sign in to your Account');

    await page.locator('input[name="password"]').fill('Test@123');
    await page.locator('button:has-text("Login")').click();
    await expect(page).toHaveTitle(/Getways/i);

    // await expect(page).toHaveURL('https://skynbliss.co/playerDashboard');

    // Click on "Redeem" tab if not already on it
    await page.getByRole('button', { name: /Wallet/i }).click();

    await page.locator("//button[normalize-space()='Cashout']").click();

    const amountInput = page.locator('input.MuiInputBase-input');
    await expect(amountInput).toBeVisible();
    await amountInput.fill('');
    await amountInput.fill('15');

    await page.locator('//button[normalize-space()="Next"]').click();

    // Cashout amount you already filled
    const cashoutAmount = 15;

    // Wait for cards to be visible
    await page.locator('h6.card-title').first().waitFor({ state: 'visible', timeout: 10000 });

    // Get all cards and select one that fits the range
    const cards = page.locator('div.col-md-4');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const valueText = await card.locator('.card-text').textContent(); // e.g., "Value Range: $5 - $500"

    const match = valueText?.match(/\$(\d+)\s*-\s*\$(\d+)/);
    if (!match) continue;

    const min = parseInt(match[1]);
    const max = parseInt(match[2]);

    if (cashoutAmount >= min && cashoutAmount <= max) {
        await card.click(); // Select the card
        break;
    }
    }

    // Click on the Next button after card is selected
    await page.getByRole('button', { name: 'Confirm' }).click();

    //  // After clicking "Next" on gift card step
    // await expect(page.getByRole('heading', { name: 'Confirm Your Details' })).toBeVisible();

    // Check fields are disabled
    const firstName = page.locator('input[id=":r3k:"]');
    const lastName = page.locator('input[id=":r3m:"]');
    const email = page.locator('input[id=":r3n:"]');

    await expect(firstName).toBeDisabled();
    await expect(lastName).toBeDisabled();
    await expect(email).toBeDisabled();

    // Then proceed
    await page.getByRole('button', { name: 'CONFIRM & PROCEED' }).click();


});
