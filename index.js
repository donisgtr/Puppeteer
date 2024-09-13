const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Rota principal (GET /)
app.get('/', (req, res) => {
  res.json({ message: 'Olá, bem-vindo à minha API!' });
});

// Rota exemplo para retornar informações de um usuário (GET /user)
app.get('/user', (req, res) => {
  res.json({
    id: 1,
    name: 'Lucas Montano',
    email: 'lucas@example.com',
  });
});

// Rota para iniciar o Puppeteer e retornar a imagem como binário
app.get('/start-puppeteer', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true // não abrir
    });
    const page = await browser.newPage();
    await page.goto('https://cliente.apdata.com.br/dicon/', {
      waitUntil: 'networkidle2',
    });

    // clicando no botão de aceitar os cookies
    await page.waitForSelector('#button-1020');
    await page.click('#button-1020');

    // Preenchendo o usuário
    await page.waitForSelector('#ext-156');
    await page.click('#ext-156');
    await page.type('#ext-156', '2738045');

    // Preenchendo a senha
    await page.waitForSelector('#ext-155');
    await page.click('#ext-155');
    await page.type('#ext-155', 'Public@99');

    // Clicando no botão de login
    await page.waitForSelector('#ext-151');
    await page.click('#ext-151');

    // Espera a navegação completar
    try {
      await page.waitForNavigation({ timeout: 90000, waitUntil: 'networkidle2' });
    } catch (error) {
      console.error('Erro de navegação:', error.message);
    }

    // Captura a screenshot e retorna como buffer
    const screenshotBuffer = await page.screenshot();

    await browser.close();

    // Define o cabeçalho para indicar que é uma imagem PNG
    res.set('Content-Type', 'image/png');

    // Envia a imagem como binário
    res.end(screenshotBuffer, 'binary');
  } catch (error) {
    console.error('Erro na automação:', error.message);
    res.status(500).json({ error: 'Erro ao realizar a automação.' });
  }

});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
