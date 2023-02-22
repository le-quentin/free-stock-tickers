import buildService from '@free-stock-tickers/service/tickersService.js';

import test from 'ava';
import sinon from 'sinon';

function stubScraperGetCurrentValue(value) {
  return {
    getCurrentValue: sinon.stub().resolves(value)
  };
}

test('Build with default dependencies', t => {
  const service = buildService();
  t.truthy(service);
  t.truthy(service.investingScraper);
});

['AA', 'ABC', 'CKDU'].map(searchString => 
  test(`Find value '${searchString}' with Yahoo Scraper`, async t => {
    const yahooScraperStub = stubScraperGetCurrentValue(42);
    const service = buildService({yahooScraper: yahooScraperStub})

    const value = await service.findOne({ searchString: 'AAAA' });

    t.is(value, 42);
    yahooScraperStub.getCurrentValue.calledOnceWith('AAAA');
}));

['A', '1', 'toto', 'ab', 'AB1C', 'a dummy string'].map(searchString => 
  test(`Find value '${searchString}' with Investing Scraper`, async t => {
    const investingScraperStub = stubScraperGetCurrentValue(42);
    const service = buildService({investingScraper: investingScraperStub})

    const value = await service.findOne({ searchString: 'aCode' });

    t.is(value, 42);
    investingScraperStub.getCurrentValue.calledOnceWith('aCode');
}));

