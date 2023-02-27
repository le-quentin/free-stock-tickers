import { default as express, Request, Response, NextFunction } from 'express';
import routes from './routes.js';

const port = process.env.APP_PORT || 3000;

const app = express();

// API call log filter
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toLocaleString().replace(',', ' ')}] - ${req.method} ${req.url}`);
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(routes);

// Global error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, () => {
  console.log(`
    ----------------------------------------------
    free-stock-tickers listening on port ${port}
    ----------------------------------------------
  `);
});
