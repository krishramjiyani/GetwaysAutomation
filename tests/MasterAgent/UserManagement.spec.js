import { test, expect } from '@playwright/test';

// ==== Reusable login ====
const login = async (page) => {
  await page.goto('https://skynbliss.co/login', { waitUntil: 'domcontentloaded' });
  await page.locator('input[name="emailPhone"]').fill('Agent123@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('h6')).toHaveText('Sign in to your Account');
  await page.locator('input[name="password"]').fill('Agent@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveTitle(/Getways/i);
  await expect(page.getByText(/User management/i)).toBeVisible();
};

// ==== Reusable createUser ====
async function createUser(page, { username, name, phone, email, password, userType, parentType }) {
  await page.getByRole('button', { name: 'ADD NEW USER' }).click();

  await page.locator('input[placeholder="e.g. John_Doe"]').fill(username);
  await page.locator('input[placeholder="e.g. John"]').fill(name);
  await page.locator('input[placeholder="e.g. 0123456789"]').fill(phone);
  await page.locator('input[placeholder="e.g. johndoe@example.com"]').fill(email);

  await page.getByLabel('User Type').selectOption(userType);
  await page.getByLabel('Parent Type').selectOption(parentType);

  await page.locator('input[type="password"]').nth(0).fill(password);
  await page.locator('input[type="password"]').nth(1).fill(password);

  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(page.getByText(username)).toBeVisible({ timeout: 15000 });
}

test('Create Agent and Player users', async ({ page }) => {
  await login(page);
  await page.getByText('User Management', { exact: true }).click();

  // Create Agent
  await createUser(page, {
    username: 'Agent_Test01',
    name: 'Agent Tester',
    phone: '9876543210',
    email: 'agent01@example.com',
    password: 'Agent@123',
    userType: 'Agent',
    parentType: 'Master-Agent: Rocky',
  });

  // Create Player
  await createUser(page, {
    username: 'Player_Test01',
    name: 'Player Tester',
    phone: '9123456789',
    email: 'player01@example.com',
    password: 'Player@123',
    userType: 'Player',
    parentType: 'Garuda',
  });
});


// test('Create new user via Add New User modal', async ({ page }) => {   //add new details evry time
//   await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//   await page.locator('//input[@id="userName"]').fill('test909');
//   await page.locator('//input[@id="name"]').fill('Test User');
//   await page.locator('//input[@id="phoneNumber"]').fill('9905990913');
//   await page.locator('//input[@id="email"]').fill('test_user_909@example.com');
//   await page.locator('//input[@id="password"]').fill('Test@123');
//   await page.locator('//input[@id="confirmPassword"]').fill('Test@123');

//   await page.locator('//button[normalize-space()="Confirm"]').click();

//   await expect(page.locator('//input[@id="userName"]')).toBeHidden();

// });

// test('Password field validation errors', async ({ page }) => {
//     await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//     await page.locator('//input[@id="userName"]').fill('test012');
//     await page.locator('//input[@id="name"]').fill('Test User');
//     await page.locator('//input[@id="phoneNumber"]').fill('9787999999');
//     await page.locator('//input[@id="email"]').fill('testpassword@example.com');

//     // Invalid password (no uppercase, no special char, <6 characters)
//     await page.locator('//input[@id="password"]').fill('acs');
//     await page.locator('//input[@id="confirmPassword"]').fill('acs');

//     await page.locator('//button[normalize-space()="Confirm"]').click();

//     const passwordErrors = [
//         "Password must be at least 6 characters long and include at least one uppercase letter, one special letter, and one number."
//     ];

//     for (const error of passwordErrors) {
//         await expect(page.locator(`text=${error}`)).toBeVisible();
//     }
// });


// test('Username format validation', async ({ page }) => {
//   await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//   await page.locator('//input[@id="userName"]').fill('iqwuiqwiu8jw8');
//   await page.locator('//input[@id="name"]').fill('Test User');
//   await page.locator('//input[@id="phoneNumber"]').fill('9123456789');
//   await page.locator('//input[@id="email"]').fill('invaliduser@example.com');
//   await page.locator('//input[@id="password"]').fill('Test@123');
//   await page.locator('//input[@id="confirmPassword"]').fill('Test@123');

//   await page.locator('//button[normalize-space()="Confirm"]').click();

//   await expect(page.locator('text=Username must be 3-10 characters long')).toBeVisible();
// });


// test('Username already taken error', async ({ page }) => {
//   await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//   await page.locator('//input[@id="userName"]').fill('test002');
//   await page.locator('//input[@id="name"]').fill('Test User');
//   await page.locator('//input[@id="phoneNumber"]').fill('9123456789');
//   await page.locator('//input[@id="email"]').fill('newemail@example.com');
//   await page.locator('//input[@id="password"]').fill('Test@123');
//   await page.locator('//input[@id="confirmPassword"]').fill('Test@123');

//   await page.locator('//button[normalize-space()="Confirm"]').click();

//   await expect(page.locator('text=Username is already taken.')).toBeVisible();
// });

// test('Phone number already in use', async ({ page }) => {
//   await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//   await page.locator('//input[@id="userName"]').fill('newuser01');
//   await page.locator('//input[@id="name"]').fill('Test User');
//   await page.locator('//input[@id="phoneNumber"]').fill('9999999999'); // Already used number
//   await page.locator('//input[@id="email"]').fill('newemail001@example.com');
//   await page.locator('//input[@id="password"]').fill('Test@123');
//   await page.locator('//input[@id="confirmPassword"]').fill('Test@123');

//   await page.locator('//button[normalize-space()="Confirm"]').click();

//   await expect(page.locator('text=Phone number is already in use.')).toBeVisible();
// });

// test('Email already registered', async ({ page }) => {
//   await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//   await page.locator('//input[@id="userName"]').fill('newuser002');
//   await page.locator('//input[@id="name"]').fill('Test User');
//   await page.locator('//input[@id="phoneNumber"]').fill('9876543210');
//   await page.locator('//input[@id="email"]').fill('test_user_001@example.com');
//   await page.locator('//input[@id="password"]').fill('Test@123');
//   await page.locator('//input[@id="confirmPassword"]').fill('Test@123');

//   await page.locator('//button[normalize-space()="Confirm"]').click();

//   await expect(page.locator('text=Email is already registered.')).toBeVisible();
// });


// test('All fields required validation in Add New User modal', async ({ page }) => {
//   await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//   await page.locator('//button[normalize-space()="Confirm"]').click();

//   const passwordErrors = [
//     "Username is required Name is required Phone number is required Email is required Password is required",
//   ];

//   for (const error of passwordErrors) {
//     await expect(page.locator(`text=${error}`)).toBeVisible();
//   }
// });


// test('Cancel button closes Add New User modal', async ({ page }) => {

//     await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//     await page.locator("//button[normalize-space()='Cancel']").click();

//     await expect(page.locator("//p[normalize-space()='User management']")).toBeVisible();
//     //  console.log('Cancel button works — modal closed successfully.');
// });


// test('Search users by Username in User Management', async ({ page }) => {

//     const searchInput = page.locator('//input[@placeholder="Username"]');
//   await expect(searchInput).toBeVisible();
//   await expect(searchInput).toHaveAttribute('placeholder', 'Username');

//   await searchInput.fill('TestPlayer');

//   const resultRow = page.locator('//tbody/tr[td[contains(., "TestPlayer")]]');
//   await expect(resultRow).toBeVisible();

//   console.log('Username search returned expected result.');

//   await searchInput.fill('');

//   const otherUser1 = page.locator('//tbody/tr[td[contains(., "TestPlayer")]]');

//   await expect(otherUser1).toBeVisible();

//   console.log('results are visible.');
// });


// test('Search users by Email via Filter in User Management', async ({ page }) => {
//   // Click the Filter button
//   const filterButton = page.locator('//button[normalize-space()="Filter"]');
//   await filterButton.click();
//   const selectedOption = page.getByText('Username', { exact: true });
//   await selectedOption.click();
//   // 3. Click on "Email"
//   const emailOption = page.getByRole('option', { name: 'Email' });
//   await emailOption.click();
//   // Click Apply button
//   const applyButton = page.locator('//button[span[contains(.,"Apply")]]');
//   await applyButton.click();
//   // Locate Email search input
//   const emailSearchInput = page.locator('//input[@placeholder="Email"]');
//   await expect(emailSearchInput).toBeVisible();
//   // Fill in the email to search
//   await emailSearchInput.fill('TestPlayer@gmail.com');
//   // Verify result row
//   const resultRow = page.locator('//tbody/tr[td[contains(., "TestPlayer@gmail.com")]]');
//   await expect(resultRow).toBeVisible();
//   console.log('✅ Email search returned expected result.');
// });

// test('Field validations check on User Management Redeem', async ({ page }) => {

//   // Step 2: Search for username
//   const searchInput = page.locator('//input[@placeholder="Username"]');
//   await expect(searchInput).toBeVisible();
//   await searchInput.fill('TestPlayer');
//   await expect(searchInput).toBeVisible();
//   await page
//     .locator(`//tr[.//text()[normalize-space()='TestPlayer']]//div[contains(@class,'settings-button')]`)
//     .click();

//   await page.locator('//li[normalize-space()="Redeem"]').click();
//   await page.locator('//button[normalize-space()="Confirm"]').click();
//   await expect(page.locator('//div[@class="MuiAlert-message css-1pxa9xg-MuiAlert-message"]'))
//     .toHaveText('Redeem amount cannot be empty');
// });


// test('Redeem amount less than minimum validation', async ({ page }) => {
//   await expect(page.locator('//input[@placeholder="Username"]')).toBeVisible();
//   await page.locator('//input[@placeholder="Username"]').fill('TestPlayer');
//   await page.keyboard.press('Enter');
//   await expect(page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]`)).toBeVisible();
//   await page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]//div[contains(@class,"settings-button")]`).click();
//   await page.locator('//li[normalize-space()="Redeem"]').click();
//   await page.locator('//input[@id="redeemAmount"]').fill('10');
//   await page.locator('//button[normalize-space()="Confirm"]').click();
//   const alertMessage = page.locator('//div[@class="MuiAlert-message css-1pxa9xg-MuiAlert-message"]');
//   await expect(alertMessage).toHaveText('Redeem amount cannot be less than 15.');
// });


// test('Redeem amount negative value validation', async ({ page }) => {

//   await expect(page.locator('//input[@placeholder="Username"]')).toBeVisible();
//   await page.locator('//input[@placeholder="Username"]').fill('TestPlayer');
//   await page.keyboard.press('Enter');
//   await expect(page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]`)).toBeVisible();
//   await page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]//div[contains(@class,"settings-button")]`).click();
//   await page.locator('//li[normalize-space()="Redeem"]').click();
//   await page.locator('//input[@id="redeemAmount"]').fill('-5');
//   await page.locator('//button[normalize-space()="Confirm"]').click();
//   const alertMessage = page.locator('//div[@class="MuiAlert-message css-1pxa9xg-MuiAlert-message"]');
//   await expect(alertMessage).toHaveText('Redeem amount must be greater than zero.');
// });


// test('Redeem with amount 15 and remark', async ({ page }) => {
//   await expect(page.locator('//input[@placeholder="Username"]')).toBeVisible();
//   await page.locator('//input[@placeholder="Username"]').fill('TestPlayer');
//   await page.keyboard.press('Enter');
//   await expect(page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]`)).toBeVisible();
//   await page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]//div[contains(@class,"settings-button")]`).click();
//   await page.locator('//li[normalize-space()="Redeem"]').click();
//   await page.locator('//input[@id="redeemAmount"]').fill('15');
//   await page.locator('//textarea[@id="remark"]').fill('Test redeem request via automation test');
//   await page.locator('//button[normalize-space()="Confirm"]').click();
//   await expect(page.locator('//p[@class="MuiTypography-root MuiTypography-body1 css-1ylhxdv-MuiTypography-root"]')).toBeVisible();

// });


// test('Change Redeem Service Fees to 0 and redeem', async ({ page }) => {
//  await expect(page.locator('//input[@placeholder="Username"]')).toBeVisible();

//   await page.locator('//input[@placeholder="Username"]').fill('TestPlayer');
//   await page.keyboard.press('Enter');
//   await expect(page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]`)).toBeVisible();
//   await page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]//div[contains(@class,"settings-button")]`).click();
//   await page.locator('//li[normalize-space()="Redeem"]').click();
//   await page.locator('//input[@id="redeemAmount"]').fill('20');
//   await page.locator('//button[normalize-space()="Edit"]').click();
//   await page.locator('//input[@id="redeemFees"]').fill('0');
//   await page.locator('//button[normalize-space()="Change"]').click();
//   await page.locator('//textarea[@id="remark"]').fill('changing redeem service fees to 0');
//   await page.locator('//button[normalize-space()="Confirm"]').click();
//   await expect(page.locator('//h5[normalize-space()="Confirm Redeem Fee Change"]')).toBeVisible();
//   await page.locator('//button[normalize-space()="Yes, Proceed"]').click();
//   await expect(page.locator('//p[@class="MuiTypography-root MuiTypography-body1 css-1ylhxdv-MuiTypography-root"]')).toBeVisible();
// });


// test('Redeem wallet not found for new player', async ({ page }) => {
//   await expect(page.locator('//input[@placeholder="Username"]')).toBeVisible();
//   await page.locator('//input[@placeholder="Username"]').fill('test002');
//   await page.keyboard.press('Enter');
//   await expect(page.locator(`//tr[.//text()[normalize-space()='test002']]`)).toBeVisible();
//   await page.locator(`//tr[.//text()[normalize-space()='test002']]//div[contains(@class,"settings-button")]`).click();
//   await page.locator('//li[normalize-space()="Redeem"]').click();
//   await page.locator('//input[@id="redeemAmount"]').fill('15');
//   await page.locator('//button[normalize-space()="Confirm"]').click();
//   await expect(page.locator('//label[@for="errorResponse"]')).toHaveText('Wallet not found for user: test002');
// });

// test('Check Wallet page opens', async ({ page }) => {
//   await expect(page.locator('//input[@placeholder="Username"]')).toBeVisible();
//   await page.locator('//input[@placeholder="Username"]').fill('TestPlayer');
//   await page.keyboard.press('Enter');

//   await expect(page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]`)).toBeVisible({ timeout: 5000 });

//   await page.locator(`//tr[.//text()[normalize-space()='TestPlayer']]//div[contains(@class,"settings-button")]`).click();
//   await page.locator('//li[normalize-space()="Wallet"]').click();

//   await page.waitForSelector('//h5[@class="modal-title" and normalize-space()="Wallet Details"]', { timeout: 5000 });
//   await expect(page.locator('//h5[@class="modal-title" and normalize-space()="Wallet Details"]')).toBeVisible();

//   await page.waitForSelector('//div[starts-with(normalize-space(),"$")]', { timeout: 5000 });
//   await expect(page.locator('//div[starts-with(normalize-space(),"$")]')).toBeVisible();
// });

// test('Create new unique user and verify in User Management list', async ({ page }) => {
//   // Generate unique values
//   const randomSuffix = Date.now().toString().slice(-6); // 6 digits for uniqueness
//   const uniqueUsername = `U${randomSuffix}`.slice(0, 10); // ensure max 10 chars
//   const uniqueEmail = `user_${randomSuffix}@example.com`;
//   const uniquePhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`; // always 10 digits starting with 9

//   // Step 1: Open Add New User modal
//   await page.locator("//button[.//p[normalize-space()='Add New User']]").click();

//   // Step 2: Fill user details
//   await page.locator('//input[@id="userName"]').fill(uniqueUsername);
//   await page.locator('//input[@id="name"]').fill('Test User');
//   await page.locator('//input[@id="phoneNumber"]').fill(uniquePhone);
//   await page.locator('//input[@id="email"]').fill(uniqueEmail);
//   await page.locator('//input[@id="password"]').fill('Test@123');
//   await page.locator('//input[@id="confirmPassword"]').fill('Test@123');

//   // Step 3: Submit form
//   await page.locator('//button[normalize-space()="Confirm"]').click();

//   // Step 4: Wait for modal to close
//   await expect(page.locator('//input[@id="userName"]')).toBeHidden({ timeout: 5000 });

//   // Step 5: Search for the new user in User Management
//   const searchInput = page.locator('//input[@placeholder="Username"]');
//   await expect(searchInput).toBeVisible();
//   await searchInput.fill(uniqueUsername);
//   await page.keyboard.press('Enter');

//   // Step 6: Verify user row appears
//   const resultRow = page.locator(`//tbody/tr[td[contains(., "${uniqueUsername}")]]`);
//   await expect(resultRow).toBeVisible({ timeout: 5000 });

//   console.log(`✅ User created: 
//     Username = ${uniqueUsername}, 
//     Email = ${uniqueEmail}, 
//     Phone = ${uniquePhone}`);
// });
