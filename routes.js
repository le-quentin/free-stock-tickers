import {Router} from 'express';
import scrapeValue from './investing-scraper.js';

const router = Router();

router.get('/tickers/:code', async (req, res) => {
  const code = req.params.code;
  console.log(`Code: ${code}`)
  const value = await scrapeValue(code);
  res.send(`${value}`);
});

export default router;
