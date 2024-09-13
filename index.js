import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = process.env.PORT || 3000;

// Endpoint que executa o Puppeteer e retorna a captura de tela
app.get('/run-script', async (req, res) => {
    console.log('Executando script...');

    try {
        // Lançando o navegador Puppeteer
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto('https://cliente.apdata.com.br/dicon/', {
            waitUntil: 'networkidle2',
        });

        console.log('Navegação concluída. Capturando screenshot...');

        // Clicando no botão de aceitar os cookies
        await page.waitForSelector('#button-1020');
        await page.click('#button-1020');

        // Preenchendo o input de usuário
        await page.waitForSelector('#ext-156');
        await page.click('#ext-156');
        await page.type('#ext-156', '2738045');

        await page.click('#ext-155');
        await page.type('#ext-155', 'Public@99');

        // Clicando no botão de login
        await page.waitForSelector('#ext-151');
        await page.click('#ext-151');

        // Tentando a navegação
        try {
            await page.waitForNavigation({ timeout: 90000, waitUntil: 'networkidle2' });
        } catch (error) {
            console.error('Erro de navegação:', error.message);
        }

             
      await page.screenshot({
        path: 'hn.png',
      });

        // Capturando a captura de tela após o login
        const screenshotBuffer = await page.screenshot('print.png');
        await browser.close();

        if (!screenshotBuffer) {
            throw new Error('Erro ao capturar a imagem. O buffer está vazio.');
        }

        console.log('Captura de tela concluída. Enviando resposta...');

        // Configurando o cabeçalho da resposta para tipo de imagem PNG
        res.set('Content-Type', 'image/png');
        res.send(screenshotBuffer);
    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).send('Erro ao executar o script');
    }
});

// Endpoint raiz para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
