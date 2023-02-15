const express = require('express');
const app = express();
const routes = require('./routes');

const port = process.env.FREE_TICKERS_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

