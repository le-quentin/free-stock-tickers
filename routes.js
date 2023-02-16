import {Router} from 'express';
import scrapeValue from './investing-scraper.js';

const router = Router();

router.get('/tickers/:code', (req, res, next) => {
  const code = req.params.code;
  console.log(`Code: ${code}`)
  return scrapeValue(code)
    .then(value => {
      res.send(`${value}`);
    })
    .catch(next);
});

export default router;
