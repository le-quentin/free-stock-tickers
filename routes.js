import {Router} from 'express';
import scrapeValue from './easybourse-scrapper.js';

const router = Router();

router.get('/tickers/:code', (req, res) => {
  const code = req.params.code;
  console.log(`Code: ${code}`)
  const value = scrapeValue(code);
  res.send(value);
});

export default router;
