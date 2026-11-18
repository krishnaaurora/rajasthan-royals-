const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../reports/final_submission/dashboard_screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait a moment for any intro drawing or auto-advance
  await new Promise(r => setTimeout(r, 2500));

  // Check if logo intro is visible, click skip/enter if present, or wait
  const skipBtn = await page.$('button');
  if (skipBtn) {
    // try clicking or wait for intro to end
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const enterBtn = btns.find(b => b.textContent && (b.textContent.includes('Enter') || b.textContent.includes('Skip') || b.textContent.includes('Explore')));
      if (enterBtn) enterBtn.click();
    });
  }

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '01_landing_hero.png') });
  console.log('Captured 01_landing_hero.png');

  // Click on "Enter Command Centre" or similar button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const target = btns.find(b => b.textContent && (b.textContent.includes('Command Centre') || b.textContent.includes('Enter') || b.textContent.includes('Launch')));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Now we should be in Command Centre
  await page.screenshot({ path: path.join(OUT_DIR, '02_command_centre.png') });
  console.log('Captured 02_command_centre.png');

  // Function to click sidebar nav items
  async function clickTabAndCapture(navText, filename) {
    const clicked = await page.evaluate((text) => {
      const items = Array.from(document.querySelectorAll('aside button, aside a, nav button, nav a'));
      const item = items.find(el => el.textContent && el.textContent.toLowerCase().includes(text.toLowerCase()));
      if (item) {
        item.click();
        return true;
      }
      return false;
    }, navText);

    if (clicked) {
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: path.join(OUT_DIR, filename) });
      console.log(`Captured ${filename}`);
    } else {
      console.warn(`Could not find nav item matching: ${navText}`);
    }
  }

  await clickTabAndCapture('Batter', '03_batter_intelligence.png');
  await clickTabAndCapture('Bowler', '04_bowler_intelligence.png');
  await clickTabAndCapture('Player Analyzer', '05_player_analyzer.png');
  await clickTabAndCapture('Pressure', '06_pressure_intelligence.png');
  await clickTabAndCapture('Model Explorer', '07_model_explorer.png');
  await clickTabAndCapture('Comparison', '08_player_comparison.png');
  await clickTabAndCapture('Judge', '09_simulation_lab.png');
  await clickTabAndCapture('Scouting', '10_rr_scouting_report.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
