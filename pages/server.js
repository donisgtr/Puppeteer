import puppeteer from 'puppeteer';


console.log('Executando script..')

const browser = await puppeteer.launch({
    headless: false
});
const page = await browser.newPage();
await page.goto('https://cliente.apdata.com.br/dicon/', {
  waitUntil: 'networkidle2',
});

// clicando no botão de aceitar os cookies
await page.locator('#button-1020').wait();
await page.locator('#button-1020').click();

// clicando no input de usuario e preenchendo com usuario
await page.locator('#ext-156').click()
await page.locator('#ext-156').fill('2738045');

await page.locator('#ext-155').click()
await page.locator('#ext-155').fill('Public@99');

//ext-151 - botão de login.
await page.locator('#ext-151').wait();
await page.locator('#ext-151').click();

//ext-139 - botão de ponto.
//await page.locator('#ext-139').wait();
//await page.locator('#ext-139').click();

try {     
    await page.waitForNavigation({timeout: 90000, waitUntil: 'networkidle2' });
  } catch (error) {
    console.error('Navigation error:', error.message);
    // Handle the error accordingly
  }

await page.screenshot({
  path: 'hn.png',
});

console.log('Terminou de Executar o script..')

await browser.close();

//tudo certo ate aqui.

