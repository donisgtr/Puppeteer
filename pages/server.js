import puppeteer from 'puppeteer';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    console.log('Executando script..');

    // Configurações do Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Deve ser headless true para rodar na Vercel
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Configuração necessária para Vercel
    });
    const page = await browser.newPage();
    await page.goto('https://cliente.apdata.com.br/dicon/', {
      waitUntil: 'networkidle2',
    });

    // Aceitar cookies
    await page.waitForSelector('#button-1020');
    await page.click('#button-1020');

    // Preencher usuário e senha
    await page.click('#ext-156');
    await page.type('#ext-156', '2738045');

    await page.click('#ext-155');
    await page.type('#ext-155', 'Public@99');

    // Clicar no botão de login
    await page.waitForSelector('#ext-151');
    await page.click('#ext-151');

    // Aguardar navegação completa
    try {
      await page.waitForNavigation({ timeout: 90000, waitUntil: 'networkidle2' });
    } catch (error) {
      console.error('Erro de navegação:', error.message);
    }

    // Tirar screenshot
    const screenshot = await page.screenshot({ encoding: 'base64' });

    await browser.close();

    console.log('Terminou de Executar o script..');

    // Retornar a imagem como resposta
    res.status(200).send(`<img src="data:image/png;base64,${screenshot}" />`);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao executar o script', error: error.message });
  }
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

export default app;
