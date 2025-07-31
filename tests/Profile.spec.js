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


 //   Change Password

test('Change password ', async ({ page }) => {

    await page.locator('//img[@alt="Account"]').click();

    await page.getByText('Change Password', { exact: true }).click();

    const passwordFields = page.locator('input[type="password"].MuiInputBase-input');

    await passwordFields.nth(0).fill('Agent@123'); // current password
    await passwordFields.nth(1).fill('Agent@123'); // new password
    await passwordFields.nth(2).fill('Agent@123');

    await page.getByRole('button', { name: 'Save' }).click();

    const successAlert = page.locator('.MuiAlert-message', { hasText: 'Password changed successfully!' });

    await expect(successAlert).toBeVisible({ timeout: 8000 });

    await expect(page).toHaveURL(/.*login/);

});


test('Change password - incorrect current password shows error', async ({ page }) => {

  await page.locator('//img[@alt="Account"]').click();
  await page.getByText('Change Password', { exact: true }).click();

  const passwordFields = page.locator('input[type="password"].MuiInputBase-input');
  await passwordFields.nth(0).fill('WrongCurrent@123'); // incorrect current password
  await passwordFields.nth(1).fill('Agent@123'); // new password
  await passwordFields.nth(2).fill('Agent@123'); // confirm password

  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.locator('text=Current password is incorrect.')).toBeVisible();
});


test('New and Confirm Password mismatch shows error', async ({ page }) => {

  await page.locator('//img[@alt="Account"]').click();
  await page.getByText('Change Password', { exact: true }).click();

  const passwordFields = page.locator('input[type="password"].MuiInputBase-input');

  await passwordFields.nth(0).fill('Agent@123');             // Current password
  await passwordFields.nth(1).fill('Agent@123');      // New password
  await passwordFields.nth(2).fill('DifferentPassword@123'); // Confirm password mismatch

  await page.getByRole('button', { name: 'Save' }).click();

  const errorMessage = page.getByText('New password and confirm password do not match.');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});


test('New password validation errors appear correctly', async ({ page }) => {

    await page.locator('//img[@alt="Account"]').click();
    await page.getByText('Change Password', { exact: true }).click();
    const passwordFields = page.locator('input[type="password"].MuiInputBase-input');

    // Input valid current password
    await passwordFields.nth(0).fill('Test@123'); // Current password

    const invalidPasswords = [
        {
            value: 'abc', // too short, no uppercase, number, or special
            expectedErrors: [
                'Password must be at least 6 characters long',
                'Password must contain at least one uppercase letter',
                'Password must contain at least one number',
                'Password must contain at least one special character'
            ]
        },
        {
            value: 'abcdef', // no uppercase, number, special
            expectedErrors: [
                'Password must contain at least one uppercase letter',
                'Password must contain at least one number',
                'Password must contain at least one special character'
            ]
        },
        {
            value: 'Abcdef', // no number, special
            expectedErrors: [
                'Password must contain at least one number',
                'Password must contain at least one special character'
            ]
        },
        {
            value: 'Abcdef1', // no special character
            expectedErrors: [
                'Password must contain at least one special character'
            ]
        },
        {
            value: 'Abcd@1', // meets all criteria
            expectedErrors: [] // No errors expected
        }
    ];

    for (const { value, expectedErrors } of invalidPasswords) {
        // Clear and fill new password
        await passwordFields.nth(1).fill('');
        await passwordFields.nth(1).fill(value);

        // Optionally blur field to trigger validation
        await passwordFields.nth(2).click();

        // Check each expected error
        for (const msg of expectedErrors) {
            const error = page.getByText(msg);
            await expect(error).toBeVisible();
        }

        // Ensure no unexpected validation messages
        if (expectedErrors.length === 0) {
            const anyError = page.locator('.MuiFormHelperText-root');
            await expect(anyError).toHaveCount(0);
        }
    }
});

test('Check Cancel button functionality on Change Password screen', async ({ page }) => {

    await page.locator('//img[@alt="Account"]').click();
    await page.getByText('Change Password', { exact: true }).click();

    await page.locator('button.custom-button.cancel').click();
    await expect(page.locator('p.MuiTypography-root.MuiTypography-body1')).toHaveText('User management');

});

// Help Videos

test('Open Help Videos and validate popup content', async ({ page }) => {

  await page.locator('//img[@alt="Account"]').click();
  await page.getByText('Help Videos', { exact: true }).click();
  await expect(page.getByText('How can we help you?')).toBeVisible();
  await expect(page.getByText('How to Login')).toBeVisible();
  await expect(page.getByText('How to Signup')).toBeVisible();
  await page.getByRole('button').getByAltText('Close').click();
  await expect(page.getByText('How can we help you?')).toHaveCount(0);
});


//logout

test('Logout flow after login', async ({ page }) => {
  await page.locator('//img[@alt="Account"]').click();

  await page.getByText('Logout', { exact: true }).click();

  await expect(page).toHaveURL(/.*login/);

});
