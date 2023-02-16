import express from 'express';
import routes from './routes.js';

const port = process.env.FREE_TICKERS_PORT || 3000;

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use(routes);

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.message || 'Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
