import {Router} from 'express';
import Scraper from '#free-stock-tickers/scrapers/investing-scraper.js';
import buildTickersService from '#free-stock-tickers/service/tickersService.js';

const router = Router();
const scraper = Scraper();
const tickersService = buildTickersService();

router.get('/tickers', (req, res, next) => {
  const searchString = req.query.searchString as string;
  if (!searchString) {
    res.status(400).send('searchString query parameter is mandatory');
    return;
  }

  console.log(`searchString: ${searchString}`)
  return tickersService.findOne(searchString)
    .then(value => {
      res.setHeader('Content-Type', 'text/csv');
      res.send(`currentValue\r\n${value}`);
    })
    .catch(next);
});

export default router;
