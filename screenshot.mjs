import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 25000 });

await new Promise(r => setTimeout(r, 6000));

// Scroll down to the arena section
await page.evaluate(() => {
  window.scrollTo({ top: 700, behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 1500));

// Screenshot of Arena Section at scroll position 700
await page.screenshot({
  path: 'C:/Users/krish/.gemini/antigravity/brain/31becb8b-b70e-4ac3-94bb-b6b806c9ca92/arena-scrolled-verify.png',
  fullPage: false,
  clip: { x: 0, y: 0, width: 1440, height: 900 }
});

console.log('Scrolled screenshot saved successfully!');
await browser.close();
