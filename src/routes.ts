import {Router} from 'express';
import buildTickersService from '#free-stock-tickers/service/tickers-service.js';
import objectsToCsv from 'objects-to-csv';

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
      const csv = new objectsToCsv([ticker]);
      res.send(await csv.toString());
    })
    .catch(next);
});

export default router;
