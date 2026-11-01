const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.click('button:has-text("Sign Up")');
  await page.fill('input[name="password"]', 'weak');
  const text = await page.innerText('.mt-3');
  console.log('UI for weak:\n', text);
  await page.fill('input[name="password"]', 'Valid123!');
  const text2 = await page.innerText('.mt-3');
  console.log('\nUI for Valid123!:\n', text2);
  await browser.close();
})();
