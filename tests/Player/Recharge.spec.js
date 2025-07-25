import { test, expect } from '@playwright/test';

test('Complete flow: Login and Recharge using Pay By Card (Stripe)', async ({ page }) => {

    await page.goto('https://skynbliss.co/login', { timeout: 120000, waitUntil: 'load' });

    await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('h6')).toHaveText('Sign in to your Account');

    await page.locator('input[name="password"]').fill('Test@123');
    await page.locator('button:has-text("Login")').click();
    await expect(page).toHaveTitle(/Getways/i);

    await page.waitForURL('https://skynbliss.co/playerDashboard', { timeout: 10000 });

    await page.locator('p.MuiTypography-root', { hasText: '50' });

    await page.getByLabel('Payment Portal');

    await page.waitForTimeout(2000);


    await page.waitForSelector("//div[contains(., 'Pay By Card')]", { timeout: 60000 });


    const stripeButton = page.locator("//p[normalize-space()='Pay By Card']");

    await stripeButton.waitFor({ state: 'attached', timeout: 60000 });

    await stripeButton.scrollIntoViewIfNeeded();
    await stripeButton.waitFor({ state: 'visible', timeout: 60000 });

    await stripeButton.click();

    await page.waitForURL('https://skynbliss.co/stripe-payment', { timeout: 60000 });

    const emailFrame = page.frameLocator('iframe').first();
    await emailFrame.locator('input#email').waitFor({ state: 'visible', timeout: 60000 });
    await emailFrame.locator('input#email').fill('testplayer@gmail.com');

    const allFrames = page.frames();
    let cardFrame;

    for (const frame of allFrames) {
        const input = await frame.$('input#cardNumber');
        if (input) {
            cardFrame = frame;
            break;
        }
    }

    if (!cardFrame) {
        throw new Error('Card number iframe not found');
    }

    await cardFrame.waitForSelector('input#cardNumber', { timeout: 10000 });
    await cardFrame.fill('input#cardNumber', '4242 4242 4242 4242');

    let expiryFrame;
    for (const frame of page.frames()) {
        const input = await frame.$('input#cardExpiry');
        if (input) {
            expiryFrame = frame;
            break;
        }
    }

    if (!expiryFrame) throw new Error('Card expiry iframe not found');

    // Fill expiry date
    await expiryFrame.fill('input#cardExpiry', '04/42');


    let cvcFrame;
    for (const frame of page.frames()) {
        const input = await frame.$('input#cardCvc');
        if (input) {
            cvcFrame = frame;
            break;
        }
    }
    if (!cvcFrame) throw new Error('Card CVC iframe not found');
    await cvcFrame.fill('input#cardCvc', '123');

    let nameFrame;
    for (const frame of page.frames()) {
        const input = await frame.$('input#billingName');
        if (input) {
            nameFrame = frame;
            break;
        }
    }
    if (!nameFrame) throw new Error('Billing name iframe not found');
    await nameFrame.fill('input#billingName', 'Test Player');

    let payFrame;
    for (const frame of page.frames()) {
        const btn = await frame.$('button[type="submit"]');
        if (btn) {
            payFrame = frame;
            break;
        }
    }
    if (!payFrame) throw new Error('Pay button iframe not found');

    
    const payBtn = payFrame.locator('button[type="submit"]', { hasText: 'Pay' });
    await payBtn.waitFor({ state: 'visible', timeout: 20000 });
    await payBtn.click();

    await page.locator('h2').waitFor({ state: 'visible', timeout: 30000 });

    await expect(page.locator('h2')).toHaveText('Completed Payment');
    
    await page.locator("//button[normalize-space()='Back']").click();

    await expect(page).toHaveURL('https://skynbliss.co/playerDashboard');
});