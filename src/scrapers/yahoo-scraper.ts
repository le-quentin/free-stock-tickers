import defaultHttpClient from '#free-stock-tickers/http/http-client.js';
import * as cheerio from 'cheerio';

const ROOT_URL = 'https://www.finance.yahoo.com';

export class YahooScraper {

  httpClient: any;

  constructor({ httpClient = defaultHttpClient() }) {
    this.httpClient = httpClient;
  }

  async getCurrentValue(code: string): Promise<number> {
    const url = await getPageLink(code);
    console.log(`Scraping ${url}`);
    const {data} = await this.httpClient.get(url);
    const value = searchValueInBody(data);
    if (!value) {
      console.error(`Value: ${value}`);
      throw new Error('Cannot find stock value in yahoo.com page!');
    }
    console.log(`Value: ${value}`);
    return Number(value);
  }
}

function searchValueInBody(body: string) {
  const $ = cheerio.load(body);

  let tag = $('#quote-header-info [data-field="regularMarketPrice"]');
  if (tag.length) return Number(tag.attr('value'));
  
  throw new Error('Cannot find relevant html tag in yahoo.com page!');
}

async function getPageLink(code: string) {
  return `${ROOT_URL}/quote/${code}`
}


export default function(dependencies = {}) {
  return new YahooScraper(dependencies);
}
