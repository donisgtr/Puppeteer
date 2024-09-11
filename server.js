import puppeteer from 'puppeteer';

(async () => {
  console.log('Executando script...');

  const browser = await puppeteer.launch({
    headless: true,  // Modo headless para rodar em produção
    args: ['--no-sandbox', '--disable-setuid-sandbox'],  // Flags necessárias para o Chromium em ambientes de contêiner
  });

  const page = await browser.newPage();
  await page.goto('https://cliente.apdata.com.br/dicon/', {
    waitUntil: 'networkidle2',
  });

  // clicando no botão de aceitar os cookies
  await page.locator('#button-1020').wait();
  await page.locator('#button-1020').click();

  // preenchendo as credenciais
  await page.locator('#ext-156').click();
  await page.locator('#ext-156').fill('2738045');
  await page.locator('#ext-155').click();
  await page.locator('#ext-155').fill('Public@99');

  // clicando no botão de login
  await page.locator('#ext-151').wait();
  await page.locator('#ext-151').click();

  // tentando navegação e capturando screenshot
  try {
    await page.waitForNavigation({ timeout: 90000, waitUntil: 'networkidle2' });
  } catch (error) {
    console.error('Navigation error:', error.message);
  }

  await page.screenshot({ path: 'hn.png' });

  console.log('Terminou de executar o script...');
  await browser.close();
})();
