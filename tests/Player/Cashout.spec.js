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
    await page.getByRole('button', { name: /Wallet/i }).click();
});


test('Cashout', async ({ page }) => {

    await page.locator("//button[normalize-space()='Cashout']").click();

    const amountInput = page.locator('input.MuiInputBase-input');
    await expect(amountInput).toBeVisible();
    await amountInput.fill('');
    await amountInput.fill('15');

    await page.locator('//button[normalize-space()="Next"]').click();

    const cashoutAmount = 15;

    await page.locator('h6.card-title').first().waitFor({ state: 'visible', timeout: 10000 });

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
            await card.click();
            break;
        }
    }

    await page.getByRole('button', { name: 'Confirm' }).click();

    const firstName = page.getByLabel('First Name');
    const lastName = page.getByLabel('Last Name');
    const email = page.getByLabel('Email');

    await expect(firstName).toBeVisible();
    await expect(firstName).toBeDisabled();

    await expect(lastName).toBeVisible();
    await expect(lastName).toBeDisabled();

    await expect(email).toBeVisible();
    await expect(email).toBeDisabled();

    await page.getByRole('button', { name: 'CONFIRM & PROCEED' }).click();

    await expect(page.getByText('Gift card successfully added')).toBeVisible();

});


test('Cashout amount less than $15 should show error', async ({ page }) => {

    await page.locator("//button[normalize-space()='Cashout']").click();

    const amountInput = page.locator('input.MuiInputBase-input');
    await expect(amountInput).toBeVisible();

    await amountInput.fill(''); // Clear field
    await amountInput.fill('10'); // Fill less than $15

    await page.locator('//button[normalize-space()="Next"]').click();

    // Assert the error message appears
    await expect(
        page.locator('div.alert.alert-danger', { hasText: 'Cashout request should not be less than $15.' })
    ).toBeVisible();
});

