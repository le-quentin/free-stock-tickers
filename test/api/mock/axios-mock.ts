import {HttpInterface, HttpResponse} from '#free-stock-tickers/http/http-client.js';
import * as fakePage from './fake-page.js';

function createResponseStub(status: number, data: string): Promise<HttpResponse<any>> {
	return Promise.resolve({
		data,
		status,
		statusText: 'toto',
		headers: null,
    config: null
	});
}

class HttpMock implements HttpInterface {
    private static instance: HttpMock = null;

    private pages: Map<string, string>;

    private constructor() {
        this.pages = new Map([
            ...fakePage.yahooPages('META', 42.42),
            ...fakePage.investingPages('NL0006454928', 1337),
        ].map(page => [page.url, page.content]));
    }

    async get(url: string, config?: any): Promise<HttpResponse<string>> {
        console.log('Calling mock Http');
        if(!this.pages.has(url)) {
            return createResponseStub(404, 'Can\'t find the page!');
        }
        return createResponseStub(200, this.pages.get(url));
    }

    static get(): HttpMock {
        if (!HttpMock.instance) {
            HttpMock.instance = new HttpMock();
        }
        return HttpMock.instance;
    }
}

export default HttpMock.get;
