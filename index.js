const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const rotaTickets = require('./routes/tickets');
app.use('/', rotaTickets);

app.get('/', (req, res) => {
  res.send('API conectada com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});