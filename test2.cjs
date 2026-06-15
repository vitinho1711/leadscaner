const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--lang=pt-BR', '--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.google.com/maps/search/Hamburgueria+em+Belo+Horizonte', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 8000));
  
  const data = await page.evaluate(async () => {
    const results = [];
    const links = Array.from(document.querySelectorAll('a[href*="/maps/place/"]')).slice(0, 3);
    for (const link of links) {
      link.click();
      await new Promise(r => setTimeout(r, 1500));
      
      let phone = 'não informado';
      const detailPanel = document.querySelector('div[role="main"]');
      if (detailPanel) {
         // Button specifically for phone:
         const phoneBtn = detailPanel.querySelector('button[data-item-id^="phone:tel:"]');
         if (phoneBtn) {
             phone = (phoneBtn.getAttribute('aria-label') || phoneBtn.innerText || '').match(/\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/)?.[0] || 'não informado';
         } else {
             const match = detailPanel.innerText.match(/\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/);
             if (match) phone = match[0];
         }
      }
      
      const card = link.closest('div.Nv2PK') || link.parentElement.parentElement.parentElement;
      results.push({
        name: link.getAttribute('aria-label'),
        phone: phone.replace(/[^\d+]/g, ''),
        cardText: card ? card.innerText.replace(/\n/g, ' ') : ''
      });
    }
    return results;
  });
  console.log(data);
  await browser.close();
})();
