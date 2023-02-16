import express from 'express';
import routes from './routes.js';

const port = process.env.FREE_TICKERS_PORT || 3000;

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
