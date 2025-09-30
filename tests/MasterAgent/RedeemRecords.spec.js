import { test, expect } from '@playwright/test';

// test('End-to-End Redeem flow (Player Redeem -> Verify in Agent Redeem Records)', async ({ page }) => {

//     // ==== STEP 1: Player Login ====
//     await page.goto('https://skynbliss.co/login', { timeout: 120000 });
//       await page.locator('input[name="emailPhone"]').fill('TestPlayer@gmail.com');
//       await page.getByRole('button', { name: 'Next' }).click();
//       await expect(page.locator('h6')).toHaveText('Sign in to your Account');
//       await page.locator('input[name="password"]').fill('Test@123');
//       await page.getByRole('button', { name: 'Login' }).click();
//       await expect(page).toHaveTitle(/Getways/i);
//        await page.getByText('Recharge your account').waitFor({ state: 'visible' });
//        await page.getByRole('button', { name: /Redeem/i }).click();
//       // ==== STEP 2: Player Redeem Request ====
//       const selectedAmount = page.locator("//button[.//p[normalize-space()='50']]");
//       await expect(selectedAmount).toHaveClass(/MuiButtonBase-root/); 
//       await page.locator('//input[@type="text" and @aria-invalid="false"]').fill('Test redeem for automation');
//       await page.getByRole('button', { name: /Redeem Request/i }).click();
//       await expect(page.locator("//div[@class='MuiSnackbarContent-message css-1exqwzz-MuiSnackbarContent-message']")).toBeVisible();

//       // ==== STEP 3: Logout Player ====
//       await page.locator('//img[@alt="Account"]').click();
//       await page.getByText('Logout', { exact: true }).click();
//       await expect(page).toHaveURL(/login/);

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

//       // ==== STEP 6: Filter by Transaction Amount & Verify ====
//       const filterButton = page.getByRole('button', { name: 'Filter' });
//       await filterButton.click();

//       await page.locator('div[role="combobox"]', { hasText: 'Account' }).click();

//       await page.getByRole('option', { name: 'Redeem' }).click();

//       const applyButton = page.getByRole('button', { name: 'Apply' });
//       await applyButton.click();

//       const transactionAmount = page.locator('//input[@placeholder="TransactionAmount"]');
//       await transactionAmount.fill('50');
//       await page.keyboard.press('Enter');

//       // Verify row with 50 exists
//       const resultRow = page.locator('//tbody/tr[td[contains(.,"50")]]').first();
//       await expect(resultRow).toBeVisible({ timeout: 30000 });

//       console.log('✅ Redeem flow verified: Player redeem of 50 found in Agent Redeem Records.');
// });

// test('Verify Refresh button reloads Redeem Records', async ({ page }) => {
//   // ==== STEP 1: Agent Login ====
//   await page.goto('https://skynbliss.co/login', { timeout: 120000 });
//   await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
//   await page.getByRole('button', { name: 'Next' }).click();
//   await expect(page.locator('h6')).toHaveText('Sign in to your Account');
//   await page.locator('input[name="password"]').fill('Agent@123');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await expect(page).toHaveTitle(/Getways/i);

//   // ==== STEP 2: Navigate to Redeem Records ====
//   await page.getByText('Redeem Records', { exact: true }).click();
//   await expect(page.locator("//div[@class='MuiBox-root css-1pccdic']")).toBeVisible();

//   // ==== STEP 3: Verify Refresh Button ====
//   const refreshBtn = page.locator("//p[@class='MuiTypography-root MuiTypography-body1 css-18una5s-MuiTypography-root']");
//   await expect(refreshBtn).toBeVisible({ timeout: 10000 });

//   // Capture the first row text before refresh
//   const firstRowBefore = await page.locator('//tbody/tr[1]').innerText();

//   // Click refresh
//   await refreshBtn.click();

//   // Wait for table to re-render
//   await page.waitForTimeout(2000); // small wait to ensure reload happens
//   const firstRowAfter = await page.locator('//tbody/tr[1]').innerText();

//   // Validate grid refreshed (either new data or same reloaded)
//   expect(firstRowAfter).toBeTruthy();

//   console.log('✅ Refresh button clicked and Redeem Records table reloaded successfully.');
// });


// test('Verify Export Redeem Records as PDF and Excel', async ({ page }) => {
//   // ==== STEP 1: Agent Login ====
//   await page.goto('https://skynbliss.co/login', { timeout: 120000 });
//   await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
//   await page.getByRole('button', { name: 'Next' }).click();
//   await expect(page.locator('h6')).toHaveText('Sign in to your Account');
//   await page.locator('input[name="password"]').fill('Agent@123');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await expect(page).toHaveTitle(/Getways/i);

//   // ==== STEP 2: Navigate to Redeem Records ====
//   await page.getByText('Redeem Records', { exact: true }).click();
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
// const exportBtn2 = page.getByRole('button', { name: 'Export' });
// await expect(exportBtn).toBeVisible({ timeout: 30000 });
// await exportBtn2.click();
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

test('Verify Redeem Records for all status filters', async ({ page }) => {
  // ==== STEP 1: Agent Login ====
  await page.goto('https://skynbliss.co/login', { timeout: 120000 });
  await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('h6')).toHaveText('Sign in to your Account');
  await page.locator('input[name="password"]').fill('Agent@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);

  // ==== STEP 2: Navigate to Redeem Records ====
  await page.getByText('Redeem Records', { exact: true }).click();
  await expect(page.locator("//div[@class='MuiBox-root css-1pccdic']")).toBeVisible();

  // ==== STEP 3: Status filter options ====
  const statuses = [
    'All',
    'Pending Approval',
    'Rejected',
    'Redeem Successfully',
    'Expired',
    'Failed Transaction'
  ];

  for (const status of statuses) {
    console.log(`🔍 Checking filter: ${status}`);

    // Open Filter
    await page.getByRole('button', { name: 'Filter' }).click();

    // Open Status dropdown
    const statusDropdown = page.getByRole('combobox').nth(1);
    await statusDropdown.click();

    // Select status option
    await page.getByRole('option', { name: status }).click();

    // Status column index (0-based). In your screenshot, it's the 5th column → index = 4
    const statusColumnIndex = 6;

    // Apply filter
    await page.getByRole('button', { name: 'Apply' }).click();

    // Wait for the table to update
    try {
      await page.waitForFunction(
        ([s, idx]) => {
          const tbody = document.querySelector('tbody');
          if (!tbody) return false;
          const rows = Array.from(tbody.querySelectorAll('tr'));
          if (rows.length === 0) return true;
          return rows.some(r => {
            const tds = Array.from(r.querySelectorAll('td'));
            const cell = tds[idx];
            return cell && cell.innerText.trim().includes(s);
          });
        },
        [status, statusColumnIndex],
        { timeout: 15000 }
      );
    } catch {
      console.log(`⚠️ Timed out waiting for results for status: ${status}`);
    }

    // Now check actual rows
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
      console.log(`records not found with this ${status}`);
      continue;
    }

    console.log(`✅ Found ${rowCount} records for status: ${status}`);

    if (status !== 'All') {
      for (let i = 0; i < rowCount; i++) {
        const rowStatus = (await rows.nth(i).locator('td').nth(statusColumnIndex).innerText()).trim();
        expect(rowStatus).toContain(status);
      }

    }
  }
});
