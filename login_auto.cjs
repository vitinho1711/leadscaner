const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input', { timeout: 10000 });

  const inputs = await page.$$('input');
  await inputs[0].type('admin');
  await inputs[1].type('admin123');

  const buttons = await page.$$('button');
  await buttons[0].click();

  console.log('Login realizado com sucesso!');
})();
