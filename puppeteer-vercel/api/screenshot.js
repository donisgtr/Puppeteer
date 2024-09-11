const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  let browser = null;

  try {
    // Inicia o navegador usando o chromium do ambiente serverless
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url);

    const screenshot = await page.screenshot({ encoding: 'base64' });

    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(screenshot, 'base64'));
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar o screenshot');
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
