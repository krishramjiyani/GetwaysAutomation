
import { test, expect } from '@playwright/test';

test.describe('GETWAYS Login Scenarios', () => {

  // 1. Complete Login Flow (Valid email & password)
    test('Valid login flow with correct email and password', async ({ page }) => {
    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });

    await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('h6')).toHaveText('Sign in to your Account');

    await page.locator('input[name="password"]').fill('Test@123');
    await page.locator('button:has-text("Login")').click();

    await expect(page).toHaveTitle('Getways');
    });

  // 2. Invalid Password
  test('Login with valid email but incorrect password', async ({ page }) => {
    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });

    await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
    await page.locator('button:has-text("Next")').click();

    await page.locator('input[name="password"]').fill('WrongPass123');
    await page.locator('button:has-text("Login")').click();
    await expect(page.locator('.MuiSnackbarContent-message')).toHaveText('Login failed: Invalid username/password.');
  });

  // 3. Invalid Email Format
  test('Login with invalid email format', async ({ page }) => {
    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });

    await page.locator('input[name="emailPhone"]').fill('invalid-email');
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('.MuiSnackbarContent-message')).toHaveText('User does not exist!');
  });

  // 4. Valid Email, Empty Password
  test('Leave password blank after entering valid email', async ({ page }) => {
    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });
    await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
    await page.locator('button:has-text("Next")').click();
    await page.locator('button:has-text("Login")').click();
    await expect(page.locator('.MuiFormHelperText-root')).toHaveText('Password is required');
  });

  // 5. Email Field Blank
  test('Leave email field blank', async ({ page }) => {
    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('.MuiAlert-message')).toHaveText('Please enter email or phone number', { timeout: 10000 });

  });

  // 6. Email not registered
  test('Enter non-existing email', async ({ page }) => {
    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });
    await page.locator('input[name="emailPhone"]').fill('unregistered@gmail.com');
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('.MuiSnackbarContent-message')).toHaveText('User does not exist!');
  });

  // 7. Check UI label on Email step
 test('Validate email step label', async ({ page }) => {
 await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });
  await expect(page.locator('h6')).toHaveText('Sign in to your Account');
});

  // 8. Check UI label on Password step
  test('Validate password step label', async ({ page }) => {
   await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });
    await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('h6')).toHaveText('Sign in to your Account');
  });

});
