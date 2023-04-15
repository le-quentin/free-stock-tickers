import test from 'ava';
import sinon from 'sinon';
import * as fakePages from '#test/api/mock/fake-page.js';
import {FakePage} from '#test/api/mock/fake-page.js';
import {HttpClientStaticProxy as HttpClient, HttpResponse} from '#free-stock-tickers/http/http-client.js';
import yahooScraper from '#free-stock-tickers/scrapers/yahoo-scraper.js';
import {Ticker} from '#free-stock-tickers/scrapers/ticker.js';

test('Build with default dependencies', t => {
    const scraper = yahooScraper();
    t.truthy(scraper.httpClient);
});

function stubHttpClientGets(pages: FakePage[]) {
    const httpStub = sinon.createStubInstance(HttpClient);
    pages.forEach(page => httpStub.get.withArgs(page.url).resolves({data: page.content} as HttpResponse<string>));
    return httpStub;
}

function stubHttpClientGetWithContent(content: string) {
    const httpStub = sinon.createStubInstance(HttpClient);
    httpStub.get.resolves({data: content} as HttpResponse<string>);
    return httpStub;
}


test('Get value directly with code', async t => {
    const httpClientStub = stubHttpClientGets(fakePages.yahooPages('aCode', 172.88))
    const scraper = yahooScraper({ 
        httpClient: httpClientStub
    });

    const ticker = await scraper.getTicker('aCode');

    sinon.assert.calledOnce(httpClientStub.get);
    t.regex(httpClientStub.get.getCall(0).args[0], /.*\/aCode.*/);
    t.deepEqual(ticker, new Ticker({ name: 'Meta Platforms, Inc. (META)', currentValue: 172.88 }));
});

test('Throw Error when cannot find tag in page', async t => {
    const httpClientStub = stubHttpClientGetWithContent('<html><body>A random page without the tag</body></html>');
    const scraper = yahooScraper({ 
        httpClient: httpClientStub
    });

    try {
        await scraper.getTicker("aCode");
    } catch(err) {
        t.regex(err.message, /.*Cannot find relevant html tag.*/);
        sinon.assert.calledOnce(httpClientStub.get);
        t.regex(httpClientStub.get.getCall(0).args[0], /.*\/aCode.*/);
        return;
    }
    t.fail('Should have thrown');
});

