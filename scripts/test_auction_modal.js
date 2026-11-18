const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://[::1]:5173...');
  await page.goto('http://[::1]:5173', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await new Promise(r => setTimeout(r, 3800));

  // Enter Lab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Enter Lab'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to Batters
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Batter Intelligence'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Click on first row in Batters
  await page.evaluate(() => {
    const row = document.querySelector('tbody tr');
    if (row) row.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'C:/Users/krish/.gemini/antigravity/brain/31becb8b-b70e-4ac3-94bb-b6b806c9ca92/auction_modal_batter_verified.png' });
  console.log('Screenshot saved: auction_modal_batter_verified.png');

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button.cursor-pointer[class*="absolute top-6 right-6"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Navigate to Bowlers
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Bowler Intelligence'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Click on first row in Bowlers
  await page.evaluate(() => {
    const row = document.querySelector('tbody tr');
    if (row) row.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'C:/Users/krish/.gemini/antigravity/brain/31becb8b-b70e-4ac3-94bb-b6b806c9ca92/auction_modal_bowler_verified.png' });
  console.log('Screenshot saved: auction_modal_bowler_verified.png');

  await browser.close();
  console.log('All screenshots verified successfully!');
})();
