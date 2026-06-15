const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--lang=pt-BR', '--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.google.com/maps/search/Hamburgueria+em+Belo+Horizonte', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 10000));
  
  const data = await page.evaluate(() => {
    const link = document.querySelector('a[href*="/maps/place/"]');
    if(!link) return 'No link';
    const card = link.closest('div.Nv2PK') || link.parentElement.parentElement.parentElement;
    return {
      text: card ? card.innerText : 'No card text'
    };
  });
  console.log(data);
  await browser.close();
})();
