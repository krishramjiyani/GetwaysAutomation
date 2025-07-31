import { test, expect } from '@playwright/test';

// Reusable login function
const login = async (page) => {
    await page.goto('https://skynbliss.co/login', { timeout: 120000 });
    await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('h6')).toHaveText('Sign in to your Account');
    await page.locator('input[name="password"]').fill('Agent@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveTitle(/Getways/i);
};

test.beforeEach(async ({ page }) => {
    await login(page);
});
