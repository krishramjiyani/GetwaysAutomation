const {test, expect} = require("@playwright/test");

test('GETWAYS Login flow test', async({page})=>{
    //goto login page
    
    await page.goto('https://skynbliss.co/login');

    //enter email and press next

    const emailInput = page.locator('input[placeholder="Email / Phone"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('TestPlayer@gmail.com');

    const nextButton = page.locator('button', {hasText: 'NEXT'});
    await nextButton.click();

    //wait for navigation to password page
    await expect(page).toHaveURL(/loginEmail/);

    //Validate email field is filled and disabled

    const disableEmail = page.locator('input[disabled]');
    await expect(disableEmail).toHaveValue('TestPlayer@gmail.com');

    //Fill password
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

})