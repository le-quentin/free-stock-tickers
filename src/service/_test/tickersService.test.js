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

test('Find value with Investing Scraper', async t => {
  const investingScraperStub = stubScraperGetCurrentValue(42);
  const service = buildService({investingScraper: investingScraperStub})

  const value = await service.findOne("aCode");

  t.is(value, 42);
});

