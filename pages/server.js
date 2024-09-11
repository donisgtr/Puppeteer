import puppeteer from 'puppeteer';

async function handler(req, res) {
  try {
    console.log('Executando script...');

    // Configurações do Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Necessário para Vercel
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Configuração de segurança para Vercel
    });

    const page = await browser.newPage();
    await page.goto('https://cliente.apdata.com.br/dicon/', {
      waitUntil: 'networkidle2',
    });

    // Aceitando cookies
    await page.waitForSelector('#button-1020');
    await page.click('#button-1020');

    // Preenchendo os campos de login
    await page.click('#ext-156');
    await page.type('#ext-156', '2738045');
    await page.click('#ext-155');
    await page.type('#ext-155', 'Public@99');

    // Clicando no botão de login
    await page.waitForSelector('#ext-151');
    await page.click('#ext-151');

    // Aguardar a navegação
    try {
      await page.waitForNavigation({ timeout: 90000, waitUntil: 'networkidle2' });
    } catch (error) {
      console.error('Erro de navegação:', error.message);
    }

    // Tirar screenshot
    const screenshot = await page.screenshot({ encoding: 'base64' });

    await browser.close();

    console.log('Terminou de executar o script...');

    // Retornar a imagem como resposta
    res.status(200).send(`<img src="data:image/png;base64,${screenshot}" />`);
  } catch (error) {
    console.error('Erro ao executar o script:', error.message);
    res.status(500).json({ message: 'Erro ao executar o script', error: error.message });
  }
}

export default handler;
