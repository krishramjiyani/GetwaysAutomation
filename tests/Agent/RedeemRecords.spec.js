import { test, expect } from '@playwright/test';

// test('End-to-End Redeem flow (Player Redeem -> Verify in Agent Redeem Records)', async ({ page }) => {

//     // ==== STEP 1: Player Login ====
//     await page.goto('https://skynbliss.co/login', { timeout: 120000 });
//     //   await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
//     //   await page.getByRole('button', { name: 'Next' }).click();
//     //   await expect(page.locator('h6')).toHaveText('Sign in to your Account');
//     //   await page.locator('input[name="password"]').fill('Test@123');
//     //   await page.getByRole('button', { name: 'Login' }).click();
//     //   await expect(page).toHaveTitle(/Getways/i);
//     //    await page.getByText('Recharge your account').waitFor({ state: 'visible' });
//     //    await page.getByRole('button', { name: /Redeem/i }).click();
//     //   // ==== STEP 2: Player Redeem Request ====
//     //   const selectedAmount = page.locator("//button[.//p[normalize-space()='50']]");
//     //   await expect(selectedAmount).toHaveClass(/MuiButtonBase-root/); 
//     //   await page.locator('//input[@type="text" and @aria-invalid="false"]').fill('Test redeem for automation');
//     //   await page.getByRole('button', { name: /Redeem Request/i }).click();
//     //   await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();

//     //   // ==== STEP 3: Logout Player ====
//     //   await page.locator('//img[@alt="Account"]').click();
//     //   await page.getByText('Logout', { exact: true }).click();
//     //   await expect(page).toHaveURL(/login/);

//         // ==== STEP 4: Agent Login ====
//         await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
//         await page.getByRole('button', { name: 'Next' }).click();
//         await expect(page.locator('h6')).toHaveText('Sign in to your Account');
//         await page.locator('input[name="password"]').fill('Agent@123');
//         await page.getByRole('button', { name: 'Login' }).click();
//         await expect(page).toHaveTitle(/Getways/i);

//         // ==== STEP 5: Navigate to Redeem Records ====
//         await page.getByText('Redeem Records', { exact: true }).click();
//         // Verify Redeem Records page container is visible
//         await expect(page.locator("//div[@class='MuiBox-root css-1pccdic']")).toBeVisible({ timeout: 30000 });

//     //   // ==== STEP 6: Filter by Transaction Amount & Verify ====
//     //   const filterButton = page.getByRole('button', { name: 'Filter' });
//     //   await filterButton.click();

//     //   const accountCombo = page.getByRole('combobox', { name: 'Account' });
//     //   await accountCombo.click();

//     //   const transactionAmountOption = page.getByRole('option', { name: 'Transaction Amount' });
//     //   await transactionAmountOption.click();

//     //   const applyButton = page.getByRole('button', { name: 'Apply' });
//     //   await applyButton.click();

//     //   const transactionAmount = page.locator('//input[@placeholder="TransactionAmount"]');
//     //   await transactionAmount.fill('50');
//     //   await page.keyboard.press('Enter');

//     //   // Verify row with 50 exists
//     //   const resultRow = page.locator('//tbody/tr[td[contains(.,"50")]]').first();
//     //   await expect(resultRow).toBeVisible({ timeout: 30000 });

//     //   console.log('✅ Redeem flow verified: Player redeem of 50 found in Agent Redeem Records.');
// });

test.describe('Redeem Records Export Automation', () => {
  test('Login and Export Redeem Records for Current Month', async ({ page }) => {
    // Set maximum timeout for all operations
    test.setTimeout(180000); // 3 minutes total test timeout
    
    // Set default timeout for page operations
    page.setDefaultTimeout(45000); // 45 seconds for each operation
    
    try {
      // Step 1: Navigate to login page
      console.log('Step 1: Navigating to login page...');
      await page.goto('https://skynbliss.co/login', { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
      
      // Wait for page to settle
      await page.waitForTimeout(3000);
      
      // Verify login page is loaded
      await expect(page.locator('h6')).toContainText('Sign in to your Account', { timeout: 15000 });
      
      // Step 2: Fill email field
      console.log('Step 2: Filling email field...');
      await page.locator('#emailPhone').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('#emailPhone').fill('Agent123@gmail.com');
      
      // Step 3: Click Next button
      console.log('Step 3: Clicking Next button...');
      await page.getByRole('button', { name: 'Next' }).click();
      
      // Wait for password field to appear
      await page.locator('#password').waitFor({ state: 'visible', timeout: 20000 });
      
      // Step 4: Fill password field
      console.log('Step 4: Filling password field...');
      await page.locator('#password').fill('Agent@123');
      
      // Step 5: Click Login button
      console.log('Step 5: Clicking Login button...');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Wait for successful login and dashboard to load
      await page.waitForURL('**/users?**', { timeout: 45000 });
      
      // Wait for page to settle after login
      await page.waitForTimeout(5000);
      
      // Verify successful login by checking for navigation menu
      await expect(page.getByText('User Management')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Redeem Records')).toBeVisible({ timeout: 15000 });
      
      // Step 6: Navigate to Redeem Records page
      console.log('Step 6: Navigating to Redeem Records page...');
      await page.getByText('Redeem Records').click();
      
      // Wait for Redeem Records page to load
      await page.waitForURL('**/redeemRecords?**', { timeout: 30000 });
      
      // Wait for page to settle instead of networkidle
      await page.waitForTimeout(8000);
      
      // Verify Redeem Records page is loaded
      await expect(page.locator('text=Redeem Records')).toBeVisible({ timeout: 20000 });
      
      // Wait for the table to load
      await page.locator('table').waitFor({ state: 'visible', timeout: 20000 });
      
      // Additional wait for table data to load
      await page.waitForTimeout(3000);
      
      // Step 7: Locate and click Export button
      console.log('Step 7: Clicking Export button...');
      await page.getByRole('button', { name: 'Add User Export' }).waitFor({ 
        state: 'visible', 
        timeout: 15000 
      });
      await page.getByRole('button', { name: 'Add User Export' }).click();
      
      // Wait for export dialog to appear
      await page.locator('dialog').waitFor({ state: 'visible', timeout: 15000 });
      
      // Verify export dialog is open
      await expect(page.getByText('Select Month to Export')).toBeVisible({ timeout: 15000 });
      
      // Step 8: Select current month (September 2025)
      console.log('Step 8: Selecting current month (September 2025)...');
      
      // Wait for month textbox to be ready
      await page.getByRole('textbox', { name: 'Month' }).waitFor({ 
        state: 'visible', 
        timeout: 15000 
      });
      
      // Click on month field to ensure it's focused
      await page.getByRole('textbox', { name: 'Month' }).click();
      
      // Clear existing value and set current month (September 2025)
      await page.getByRole('textbox', { name: 'Month' }).fill('2025-09');
      
      // Wait for Export buttons to be enabled
      await page.waitForTimeout(3000);
      
      // Verify Export Excel button is enabled
      await expect(page.getByRole('button', { name: 'Export Excel' })).toBeEnabled({ 
        timeout: 10000 
      });
      
      // Step 9: Complete Excel export
      console.log('Step 9: Completing Excel export...');
      
      // Set up download handler
      const downloadPromise = page.waitForDownload({ timeout: 60000 });
      
      // Click Export Excel button
      await page.getByRole('button', { name: 'Export Excel' }).click();
      
      // Wait for download to complete
      const download = await downloadPromise;
      
      // Verify download
      expect(download.suggestedFilename()).toBe('RedeemRecords.xlsx');
      console.log(`File downloaded successfully: ${download.suggestedFilename()}`);
      
      // Save file to specified location (optional)
      await download.saveAs('./downloads/RedeemRecords.xlsx');
      
      // Wait for dialog to close and return to main page
      await page.waitForTimeout(5000);
      
      // Verify we're back on the Redeem Records page
      await expect(page.locator('text=Redeem Records')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
      
      console.log('✅ All steps completed successfully!');
      
      // Final verification - check pagination info to ensure data is loaded
      await expect(page.locator('text=1-10 of')).toBeVisible({ timeout: 10000 });
      
    } catch (error) {
      console.error('❌ Test failed with error:', error);
      
      // Take screenshot on failure for debugging
      await page.screenshot({ 
        path: `./screenshots/test-failure-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });
  
  test.afterEach(async ({ page }) => {
    // Close any open dialogs
    try {
      if (await page.locator('dialog[open]').isVisible()) {
        await page.keyboard.press('Escape');
      }
    } catch (error) {
      // Ignore errors in cleanup
    }
    
    // Close the page
    await page.close();
  });
});

// Additional utility test for validation
test.describe('Pre-requisite Validations', () => {
  test('Verify website accessibility and login page elements', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout
    page.setDefaultTimeout(30000);
    
    try {
      // Navigate to site with longer timeout
      await page.goto('https://skynbliss.co/login', { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
      
      // Wait for page to fully settle
      await page.waitForTimeout(5000);
      
      // Verify essential elements exist
      await expect(page.locator('h6')).toContainText('Sign in to your Account', { timeout: 15000 });
      await expect(page.locator('#emailPhone')).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: 'Next' })).toBeVisible({ timeout: 10000 });
      
      console.log('✅ Website is accessible and login elements are present');
      
    } catch (error) {
      console.error('❌ Pre-requisite validation failed:', error);
      
      // Take screenshot for debugging
      await page.screenshot({ 
        path: `./screenshots/prerequisite-failure-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });
});