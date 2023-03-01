import test from 'ava';
import sinon from 'sinon';
import * as fakePages from '#test/api/mock/fake-page.js';
import {FakePage} from '#test/api/mock/fake-page.js';
import investingScraper from '#free-stock-tickers/scrapers/investing-scraper.js';
import {AxiosResponse} from 'axios';
import {HttpClient} from '#free-stock-tickers/http/http-client.js';

test('Build with default dependencies', t => {
    const scraper = investingScraper();
    t.truthy(scraper.httpClient);
});

function stubHttpClientGets(pages: FakePage[]) {
    const httpStub = sinon.createStubInstance(HttpClient);
    pages.forEach(page => httpStub.get.withArgs(page.url).resolves({ data: page.content } as AxiosResponse));
    return httpStub;
}

function stubHttpClientGetWithContent(content: string) {
    const httpStub = sinon.createStubInstance(HttpClient);
    httpStub.get.resolves({ data: content } as AxiosResponse);
    return httpStub;
}

test('Get value directly with code', async t => {
    const httpClientStub = stubHttpClientGets(fakePages.investingPages('aCode', 42.42));
    const scraper = investingScraper({
        httpClient: httpClientStub
    });

    const value = await scraper.getCurrentValue('aCode');

    sinon.assert.calledTwice(httpClientStub.get);
    t.regex(httpClientStub.get.getCall(0).args[0], /.*aCode.*/);
    t.regex(httpClientStub.get.getCall(1).args[0], /.*\/link-to-page.*/);
    t.is(value, 42.42);
});

test('Throw Error when cannot find link in search page', async t => {
    const httpClientStub = stubHttpClientGetWithContent('<html><body>A random page without the tag</body></html>');
    const scraper = investingScraper({
        httpClient: httpClientStub
    });

    try {
        await scraper.getCurrentValue('aCode');
    } catch (err) {
        t.regex(err.message, /.*Cannot find.*search page.*/);
        sinon.assert.calledOnce(httpClientStub.get);
        t.regex(httpClientStub.get.getCall(0).args[0], /.*aCode.*/);
        return;
    }
    t.fail('Should have thrown');
});

test('Throw Error when cannot find value in value page', async t => {
    const pages = fakePages.investingPages('aCode', 42.42);
    pages[1] = {
        ...pages[1],
        content: '<html><body>A random page without the tag</body></html>'
    };
    const httpClientStub = stubHttpClientGets(pages);
    const scraper = investingScraper({
        httpClient: httpClientStub
    });

    try {
        await scraper.getCurrentValue('aCode');
    } catch (err) {
        t.regex(err.message, /.*Cannot find relevant.*value page.*/);
        return;
    }
    t.fail('Should have thrown');
});

test('Throw Error when tag 1 has empty value', async t => {
    const pages = fakePages.investingPages('aCode', 42.42);
    pages[1] = {
        ...pages[1],
        content: `<html><body><span id="last_last">toto</span></body></html>`
    };
    const httpClientStub = stubHttpClientGets(pages);
    const scraper = investingScraper({
        httpClient: httpClientStub
    });

    try {
        await scraper.getCurrentValue('aCode');
    } catch (err) {
        t.regex(err.message, /.*Cannot find stock value.*page.*/);
        return;
    }
    t.fail('Should have thrown');
});

test('Throw Error when tag 2 has empty value', async t => {
    const pages = fakePages.investingPages('aCode', 42.42);
    pages[1] = {
        ...pages[1],
        content: `<html><body><span data-test="instrument-price-last">toto</span></body></html>`
    };
    const httpClientStub = stubHttpClientGets(pages);
    const scraper = investingScraper({
        httpClient: httpClientStub
    });

    try {
        await scraper.getCurrentValue('aCode');
    } catch (err) {
        t.regex(err.message, /.*Cannot find stock value.*page.*/);
        return;
    }
    t.fail('Should have thrown');
});
