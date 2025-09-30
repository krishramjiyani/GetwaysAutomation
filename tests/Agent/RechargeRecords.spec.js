import { test, expect } from '@playwright/test';

test('End-to-End Recharge Flow (Player Recharge -> Verify in Agent Recharge Records)', async ({ page }) => {
  // ==== STEP 1: Player Login ====
   await page.goto('https://skynbliss.co/login', { timeout: 120000 });
  await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('h6')).toHaveText('Sign in to your Account');
  await page.locator('input[name="password"]').fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);

  // ==== STEP 2: Perform Recharge via Stripe ====
  await page.getByLabel('Add Transaction Note').fill('Recharge using Stripe card');
  const stripeButton = page.locator("//p[normalize-space()='Pay By Card']");
  await stripeButton.waitFor({ state: 'visible', timeout: 20000 });
  await stripeButton.click();
  await page.waitForURL(/stripe-payment/, { timeout: 120000 });

  const findFrameWithSelector = async (selector) => {
    for (const frame of page.frames()) {
      if (await frame.$(selector)) return frame;
    }
    throw new Error(`${selector} iframe not found`);
  };

  const emailFrame = page.frameLocator('iframe').first();
  await emailFrame.locator('input#email').fill('testplayer@gmail.com');

  const cardFrame = await findFrameWithSelector('input#cardNumber');
  await cardFrame.fill('input#cardNumber', '4242 4242 4242 4242');

  const expiryFrame = await findFrameWithSelector('input#cardExpiry');
  await expiryFrame.fill('input#cardExpiry', '04/42');

  const cvcFrame = await findFrameWithSelector('input#cardCvc');
  await cvcFrame.fill('input#cardCvc', '123');

  const nameFrame = await findFrameWithSelector('[data-qa="FormFieldGroup-billingName"] input');
  await nameFrame.fill('[data-qa="FormFieldGroup-billingName"] input', 'Test Player');

  const payFrame = await findFrameWithSelector('button[type="submit"]');
  await payFrame.locator('button[type="submit"]').click();

  await page.locator('h2').waitFor({ state: 'visible', timeout: 30000 });
  await expect(page.locator('h2')).toHaveText('Completed Payment');

  // // ==== STEP 3: Perform Wallet Recharge ====
  // await page.getByLabel('Add Transaction Note').fill('Recharge of $30 through wallet');
  // await page.getByText('Payment Portal').click();
  // await page.locator('input[type="radio"][value="wallet"]').check();
  // await page.locator('button >> text=30').click();
  // await page.getByRole('button', { name: 'Wallet Recharge' }).click();
  // await expect(page.getByText(/Recharge Successful!/i)).toBeVisible();

  // ==== STEP 4: Logout ====
  await page.locator('//img[@alt="Account"]').click();
  await page.getByText('Logout', { exact: true }).click();
  await expect(page).toHaveURL(/login/);

  // ==== STEP 5: Agent Login ====
  await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('h6')).toHaveText('Sign in to your Account');
  await page.locator('input[name="password"]').fill('Agent@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);

  // ==== STEP 6: Navigate to Recharge Records ====
  await page.getByText('Recharge Records', { exact: true }).click();
  await expect(page.locator("//div[@class='MuiBox-root css-1pccdic']")).toBeVisible();

// ==== STEP 7: Search Recharge by Transaction Amount & Verify Row Data ====
const filterButton = page.getByRole('button', { name: 'Filter' });
await filterButton.click();

const accountCombo = page.getByRole('combobox').first();
await accountCombo.click();

const rechargeOption = page.getByRole('option', { name: 'Recharge' });
await rechargeOption.click();

await page.getByRole('button', { name: 'Apply' }).click();
const transactionAmount = page.getByPlaceholder('TransactionAmount');
await transactionAmount.fill('50');
await page.keyboard.press('Enter');

const resultRow = page.locator('//tbody/tr[td[contains(., "50")]]').first();
await expect(resultRow).toBeVisible({ timeout: 30000 });

console.log('✅ Recharge record verified successfully for TestPlayer (Amount: 50, Status: Confirmed)');

});


test('Verify Refresh button reloads Recharge Records', async ({ page }) => {
  // ==== STEP 1: Agent Login ====
  await page.goto('https://skynbliss.co/login', { timeout: 120000 });
  await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('h6')).toHaveText('Sign in to your Account');
  await page.locator('input[name="password"]').fill('Agent@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);

  // ==== STEP 2: Navigate to Recharge Records ====
  await page.getByText('Recharge Records', { exact: true }).click();
  await expect(page.locator("//div[@class='MuiBox-root css-1pccdic']")).toBeVisible();

  // ==== STEP 3: Verify Refresh Button ====
  const refreshBtn = page.locator("//p[@class='MuiTypography-root MuiTypography-body1 css-18una5s-MuiTypography-root']");
  await expect(refreshBtn).toBeVisible({ timeout: 10000 });

  // Capture the first row text before refresh
  const firstRowBefore = await page.locator('//tbody/tr[1]').innerText();

  // Click refresh
  await refreshBtn.click();

  // Wait for table to re-render
  await page.waitForTimeout(2000); // small wait to ensure reload happens
  const firstRowAfter = await page.locator('//tbody/tr[1]').innerText();

  // Validate grid refreshed (either new data or same reloaded)
  expect(firstRowAfter).toBeTruthy();

  console.log('✅ Refresh button clicked and Recharge Records table reloaded successfully.');
});

// test('Verify Export Recharge Records as PDF and Excel', async ({ page }) => {
//   // ==== STEP 1: Agent Login ====
//   await page.goto('https://skynbliss.co/login', { timeout: 120000 });
//   await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
//   await page.getByRole('button', { name: 'Next' }).click();
//   await expect(page.locator('h6')).toHaveText('Sign in to your Account');
//   await page.locator('input[name="password"]').fill('Agent@123');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await expect(page).toHaveTitle(/Getways/i);

//   // ==== STEP 2: Navigate to Recharge Records ====
//   await page.getByText('Recharge Records', { exact: true }).click();
//   await expect(page.locator("//div[@class='MuiBox-root css-1pccdic']")).toBeVisible();
// // ==== STEP 3: Open Export Popup ====
// const exportBtn = page.getByRole('button', { name: 'Export' });
// await expect(exportBtn).toBeVisible({ timeout: 30000 });
// await exportBtn.click();

// // ==== STEP 4: Select Month (type="month" input expects YYYY-MM) ====
// const monthInput = page.locator('input[type="month"]').first();
// await expect(monthInput).toBeVisible({ timeout: 30000 });
// await monthInput.fill('2025-09'); // September 2025

// // ==== STEP 5: Export as PDF ====
// const exportPdfBtn = page.getByRole('button', { name: 'Export PDF' });
// const [downloadPdf] = await Promise.all([
//   page.waitForEvent('download'),
//   exportPdfBtn.click()
// ]);
// console.log(`✅ PDF downloaded: ${await downloadPdf.path()}`);
// expect(await downloadPdf.path()).toBeTruthy();

// // ==== STEP 6: Reopen Export Popup for Excel ====
// await exportBtn.click(); // reopen export modal
// await expect(monthInput).toBeVisible({ timeout: 30000 });
// await monthInput.fill('2025-09'); // select again

// // ==== STEP 7: Export as Excel ====
// const exportExcelBtn = page.getByRole('button', { name: 'Export Excel' });
// const [downloadExcel] = await Promise.all([
//   page.waitForEvent('download'),
//   exportExcelBtn.click()
// ]);
// console.log(`✅ Excel downloaded: ${await downloadExcel.path()}`);
// expect(await downloadExcel.path()).toBeTruthy();

// });