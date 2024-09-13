const express = require('express');
const app = express();

// Define a porta da aplicação
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

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
