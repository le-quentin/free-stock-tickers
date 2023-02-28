import {AxiosInterface} from '#free-stock-tickers/http/http-client.js';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import fakePage from './fake-page.js';

function createAxiosResponseStub(status: number, data: string): Promise<AxiosResponse<any, any>> {
	return Promise.resolve({
		data,
		status,
		statusText: 'toto',
		headers: null,
    config: null
	});
}

function fakeYahooPage(searchString: string, value: number): [string, string] {
    return [`https://www.finance.yahoo.com/quote/${searchString}`, fakePage('yahoo-value-page', new Map([[ 'value', `${value}` ]]))];
}

class AxiosMock implements AxiosInterface {
    private static instance: AxiosMock = null;

    private pages: Map<string, string>;

    private constructor() {
        this.pages = new Map([
            fakeYahooPage('META', 42.42)
        ]);
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
