import express from 'express';
import routes from './routes.js';

const port = process.env.APP_PORT || 3000;

const app = express();

// API call log filter
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString().replace(',', ' ')}] - ${req.method} ${req.url}`);
  next();
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use(routes);

// Global error handling
app.use((err, _req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.message || 'Something broke!')
});

app.listen(port, () => {
  console.log(`
    ----------------------------------------------
    free-stock-tickers listening on port ${port}
    ----------------------------------------------
  `);
});
