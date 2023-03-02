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
  t.truthy(service.investingScraper);
});

['AA', 'AA.BB', 'ABC', 'CKDU', 'GOOGL', 'MC.PA', 'TTE.PA'].map(searchString => 
  test(`Find value '${searchString}' with Yahoo Scraper`, async t => {
    const ticker = sinon.createStubInstance(Ticker);
    const yahooScraperStub = stubScraperGetTicker(ticker);
    const service = buildService({yahooScraper: yahooScraperStub})

    const result = await service.findOne('AAAA');

    t.is(result, ticker);
    yahooScraperStub.getTicker.calledOnceWith('AAAA');
}));

['A', '1', 'toto', 'ab', 'AB1C', '_ABC', 'CK-DU',
  'aa.bb', 'ABCDEF', 'AA.ABCDEF', 'a dummy string'].map(searchString => 
  test(`Find value '${searchString}' with Investing Scraper`, async t => {
    const ticker = sinon.createStubInstance(Ticker);
    const investingScraperStub = stubScraperGetTicker(ticker);
    const service = buildService({investingScraper: investingScraperStub})

    const value = await service.findOne('aCode');

    t.is(value, ticker);
    investingScraperStub.getTicker.calledOnceWith('aCode');
}));

