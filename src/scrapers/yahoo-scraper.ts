import defaultHttpClient from '#free-stock-tickers/http/http-client.js';
import * as cheerio from 'cheerio';
import {Ticker} from './ticker.js';

const ROOT_URL = 'https://www.finance.yahoo.com';

export class YahooScraper {

  httpClient: any;

  constructor({ httpClient = defaultHttpClient() }) {
    this.httpClient = httpClient;
  }

  async getTicker(code: string): Promise<Ticker> {
    const url = await getPageLink(code);
    console.log(`Scraping ${url}`);
    const {data} = await this.httpClient.get(url);
    const ticker = searchInformationInBody(data);
    if (!ticker.currentValue) {
      console.error(`Ticker: ${ticker}`);
      throw new Error('Cannot find stock value in yahoo.com page!');
    }
    console.log(`Ticker: ${ticker}`);
    return ticker;
  }
}

function searchInformationInBody(body: string) {
  const $ = cheerio.load(body);
  const name = $('#quote-header-info h1')?.text();;

  const tag = $('#quote-header-info [data-field="regularMarketPrice"]');
  if (!tag.length) throw new Error('Cannot find relevant html tag in yahoo.com page!');

  return { name, currentValue: Number(tag.attr('value')) };
}

async function getPageLink(code: string) {
  return `${ROOT_URL}/quote/${code}`
}


export default function(dependencies = {}) {
  return new YahooScraper(dependencies);
}
