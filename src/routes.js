import {Router} from 'express';
import Scraper from './scrapers/investing-scraper.js';

const router = Router();
const scraper = Scraper();

router.get('/tickers/:code', (req, res, next) => {
  const code = req.params.code;
  console.log(`Code: ${code}`)
  return scraper.getCurrentValue(code)
    .then(value => {
      res.setHeader('Content-Type', 'text/csv');
      res.send(`currentValue\r\n${value}`);
    })
    .catch(next);
});

export default router;
