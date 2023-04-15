import {HttpInterface} from '#free-stock-tickers/http/http-client.js';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import * as fakePage from './fake-page.js';

function createAxiosResponseStub(status: number, data: string): Promise<AxiosResponse<any, any>> {
	return Promise.resolve({
		data,
		status,
		statusText: 'toto',
		headers: null,
    config: null
	});
}

class AxiosMock implements HttpInterface {
    private static instance: AxiosMock = null;

    private pages: Map<string, string>;

    private constructor() {
        this.pages = new Map([
            ...fakePage.yahooPages('META', 42.42),
            ...fakePage.investingPages('NL0006454928', 1337),
        ].map(page => [page.url, page.content]));
    }

    async get(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        console.log('Calling mock Axios');
        if(!this.pages.has(url)) {
            return createAxiosResponseStub(404, 'Can\'t find the page!');
        }
        return createAxiosResponseStub(200, this.pages.get(url));
    }

    static get(): AxiosMock {
        if (!AxiosMock.instance) {
            AxiosMock.instance = new AxiosMock();
        }
        return AxiosMock.instance;
    }
}

export default AxiosMock.get;
