const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // Wait 4 seconds for intro to complete and landing page to show
  await new Promise(r => setTimeout(r, 4000));

  // Find and click Enter Lab
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Enter Lab'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  console.log('Clicked Enter Lab:', clicked);

  // Wait 2 seconds for Command Centre to mount
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'suprr-selector/reports/command_centre_verified.png' });
  console.log('Saved screenshot to suprr-selector/reports/command_centre_verified.png');

  const text = await page.evaluate(() => document.body.innerText.slice(0, 400));
  console.log('Command Centre text preview:', text.replace(/\n+/g, ' '));

  await browser.close();
})();
