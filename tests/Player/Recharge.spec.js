import { test, expect } from '@playwright/test';

const login = async (page) => {
  await page.goto('https://skynbliss.co/login', { timeout: 120000 });
  await page.locator('input[name="emailPhone"]').fill('samp@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('input[name="password"]').fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);
  await page.getByText('Recharge your account').waitFor({ state: 'visible' });
};

test.beforeEach(async ({ page }) => {
  await login(page);
});


// test('Wallet Recharge - Reject amount less than $30', async ({ page }) => {
//   await page.getByLabel('Add Transaction Note').fill('Trying recharge below min value');
//   await page.getByText('Payment Portal').click();
//   await page.locator('input[type="radio"][value="wallet"]').check();
//   await page.getByText('10', { exact: true }).click();
//   await page.getByRole('button', { name: 'Wallet Recharge' }).click();
//   await expect(page.getByText('Recharge amount must be at least $30.00.')).toBeVisible();
// });

// test('Wallet Recharge - Valid amount $30 passes', async ({ page }) => {
//   await page.getByLabel('Add Transaction Note').fill('Recharge of $30 through wallet');
//   await page.getByText('Payment Portal').click();
//   await page.locator('input[type="radio"][value="wallet"]').check();
//   await page.locator('button >> text=30').click();
//   await page.getByRole('button', { name: 'Wallet Recharge' }).click();
//   await expect(page.getByText(/Recharge Successful!/i)).toBeVisible();
// });

// test('Complete flow: Recharge using Pay By Card (Stripe)', async ({ page }) => {
//   await page.getByLabel('Add Transaction Note').fill('Recharge using Stripe card');
//   await page.getByLabel('Payment Portal');
//   await page.waitForTimeout(2000);

//   const stripeButton = page.locator("//p[normalize-space()='Pay By Card']");
//   await stripeButton.waitFor({ state: 'visible', timeout: 120000 });
//   await stripeButton.scrollIntoViewIfNeeded();
//   await stripeButton.click();

//   await page.waitForURL('https://skynbliss.co/stripe-payment', { timeout: 120000 });

//   const emailFrame = page.frameLocator('iframe').first();
//   await emailFrame.locator('input#email').fill('testplayer@gmail.com');

//   const findFrameWithSelector = async (selector) => {
//     for (const frame of page.frames()) {
//       if (await frame.$(selector)) return frame;
//     }
//     throw new Error(`${selector} iframe not found`);
//   };

//   const cardFrame = await findFrameWithSelector('input#cardNumber');
//   await cardFrame.fill('input#cardNumber', '4242 4242 4242 4242');

//   const expiryFrame = await findFrameWithSelector('input#cardExpiry');
//   await expiryFrame.fill('input#cardExpiry', '04/42');

//   const cvcFrame = await findFrameWithSelector('input#cardCvc');
//   await cvcFrame.fill('input#cardCvc', '123');

//   const nameFrame = await findFrameWithSelector('[data-qa="FormFieldGroup-billingName"] input');
//   await nameFrame.fill('[data-qa="FormFieldGroup-billingName"] input', 'Test Player');


//   const payFrame = await findFrameWithSelector('button[type="submit"]');
//   const payBtn = payFrame.locator('button[type="submit"]');
//   await payBtn.waitFor({ state: 'visible', timeout: 20000 });
//   await payBtn.click();

//   await page.locator('h2').waitFor({ state: 'visible', timeout: 30000 });
//   await expect(page.locator('h2')).toHaveText('Completed Payment');

//   await page.locator("//button[normalize-space()='Back']").click();
//   await expect(page).toHaveURL('https://skynbliss.co/playerDashboard');
// });

test('Complete flow: Recharge using Pay By Card (Stripe) with multiple amounts', async ({ page }) => {
  const amounts = ['10', '15', '20', '30', '40', '75', '100'];

  for (const amount of amounts) {
    console.log(`🔹 Testing recharge with amount: ${amount}`);

    // Step 1: Select recharge amount
    const amountBtn = page.locator(`//p[normalize-space()='${amount}']`);
    await amountBtn.waitFor({ state: 'visible', timeout: 10000 });
    await amountBtn.click();

    // Step 2: Add Transaction Note
    await page.getByLabel('Add Transaction Note').fill(`Recharge ${amount} using Stripe card`);

    // Step 3: Open Pay By Card (Stripe)
    const stripeButton = page.locator("//p[normalize-space()='Pay By Card']");
    await stripeButton.waitFor({ state: 'visible', timeout: 120000 });
    await stripeButton.scrollIntoViewIfNeeded();
    await stripeButton.click();

    // Step 4: Wait for redirect to Stripe
    await page.waitForURL('https://skynbliss.co/stripe-payment', { timeout: 240000 });

    // --- Stripe Form Filling ---
    const emailFrame = page.frameLocator('iframe').first();
    await emailFrame.locator('input#email').fill('testplayer@gmail.com');

    const findFrameWithSelector = async (selector) => {
      for (const frame of page.frames()) {
        if (await frame.$(selector)) return frame;
      }
      throw new Error(`${selector} iframe not found`);
    };

    const cardFrame = await findFrameWithSelector('input#cardNumber');
    await cardFrame.fill('input#cardNumber', '4242 4242 4242 4242');

    const expiryFrame = await findFrameWithSelector('input#cardExpiry');
    await expiryFrame.fill('input#cardExpiry', '04/42');

    const cvcFrame = await findFrameWithSelector('input#cardCvc');
    await cvcFrame.fill('input#cardCvc', '123');

    const nameFrame = await findFrameWithSelector('[data-qa="FormFieldGroup-billingName"] input');
    await nameFrame.fill('[data-qa="FormFieldGroup-billingName"] input', 'Test Player');

    // Step 5: Submit Payment
    const payFrame = await findFrameWithSelector('button[type="submit"]');
    const payBtn = payFrame.locator('button[type="submit"]');
    await payBtn.waitFor({ state: 'visible', timeout: 20000 });
    await payBtn.click();

    // Step 6: Verify Completed Payment
    await page.locator('h2').waitFor({ state: 'visible', timeout: 60000 });
    await expect(page.locator('h2')).toHaveText('Completed Payment');

    // Step 7: Back to dashboard
    await page.locator("//button[normalize-space()='Back']").click();
    await expect(page).toHaveURL('https://skynbliss.co/playerDashboard');

    // Optional small wait between iterations
    await page.waitForTimeout(2000);
  }
});

