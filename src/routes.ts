import {Router} from 'express';
import buildTickersService from '#free-stock-tickers/service/tickers-service.js';
import {stringify} from 'csv-stringify/sync';

const router = Router();
const tickersService = buildTickersService();

router.get('/tickers', (req, res, next) => {
  const searchString = req.query.searchString as string;
  if (!searchString) {
    res.status(400).send('searchString query parameter is mandatory');
    return;
  }

  console.log(`searchString: ${searchString}`)
  return tickersService.findOne(searchString)
    .then(async ticker => {
      res.setHeader('Content-Type', 'text/csv');
      const csv = stringify([ticker], { columns: ['currentValue', 'name'], header: true });
      console.log('Sending result: ', csv);
      res.send(csv);
    })
    .catch(next);
});

export default router;
