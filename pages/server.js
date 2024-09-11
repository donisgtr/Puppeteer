import puppeteer from 'puppeteer';
import express from 'express';

const app = express();
app.use(express.json());

function executarScript(req, res) {
  // Função que faz o scraping com o Puppeteer
  puppeteer.launch({
    headless: true, // Modo headless deve ser true na Vercel
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necessário para rodar na Vercel
  }).then(async (browser) => {
    try {
      console.log('Executando script...');

      const page = await browser.newPage();
      await page.goto('https://cliente.apdata.com.br/dicon/', {
        waitUntil: 'networkidle2',
      });

      // Aceitando os cookies
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

      // Esperar navegação após o login
      try {
        await page.waitForNavigation({ timeout: 90000, waitUntil: 'networkidle2' });
      } catch (error) {
        console.error('Erro de navegação:', error.message);
      }

      // Tirando o screenshot
      const screenshot = await page.screenshot({ encoding: 'base64' });

      await browser.close();
      console.log('Terminou de executar o script.');

      // Retorna a imagem como resposta
      res.status(200).send(`<img src="data:image/png;base64,${screenshot}" />`);
    } catch (error) {
      await browser.close();
      console.error('Erro ao executar o script:', error.message);
      res.status(500).json({ message: 'Erro ao executar o script', error: error.message });
    }
  });
}

app.get('/', executarScript);

// Iniciando o servidor na porta 3000 ou na porta do ambiente
function iniciarServidor() {
  const port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log(`API rodando na porta ${port}`);
  });
}

iniciarServidor();

export default app;
