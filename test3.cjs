const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--lang=pt-BR', '--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.google.com/search?q=Hamburgueria+em+Belo+Horizonte&tbm=lcl', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  
  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.rllt__details')).slice(0, 5).map(d => d.innerText);
  });
  console.log(data);
  await browser.close();
})();
