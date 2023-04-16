import {Ticker} from '#free-stock-tickers/scrapers/ticker.js';
import buildService from '#free-stock-tickers/service/tickers-service.js';

import test from 'ava';
import sinon from 'sinon';

function stubScraperGetTicker(result: Ticker) {
  return {
    getTicker: sinon.stub().resolves(result)
  };
}

test('Build with default dependencies', t => {
  const service = buildService();
  t.truthy(service);
});

['AA', 'AA.BB', 'ABC', 'CKDU', 'GOOGL', 'MC.PA', 'TTE.PA', 'E40.PA'].map(searchString => 
  test(`Find value '${searchString}' with Yahoo Scraper`, async t => {
    const ticker = {} as Ticker;
    const yahooScraperStub = stubScraperGetTicker(ticker);
    const service = buildService({yahooScraper: yahooScraperStub, investingScraper: undefined})

    const result = await service.findOne(searchString);

    t.is(result, ticker);
    yahooScraperStub.getTicker.calledOnceWith(searchString);
}));

['A', '1', 'toto', 'ab', '_ABC', 'CK-DU',
  'aa.bb', 'ABCDEF', 'AA.ABCDEF', 'a dummy string'].map(searchString => 
  test(`Find value '${searchString}' with Investing Scraper`, async t => {
    const ticker = {} as Ticker;
    const investingScraperStub = stubScraperGetTicker(ticker);
    const service = buildService({investingScraper: investingScraperStub, yahooScraper: undefined})

    const value = await service.findOne(searchString);

    t.is(value, ticker);
    investingScraperStub.getTicker.calledOnceWith(searchString);
}));

