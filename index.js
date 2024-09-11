import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Rota simples
app.get('/', (req, res) => {
  res.send('Hello from Railway!');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
