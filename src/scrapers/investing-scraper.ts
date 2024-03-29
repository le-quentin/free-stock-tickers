import defaultHttpClient, {HttpClient} from '../http/http-client.js';
import * as cheerio from 'cheerio';
import {Ticker} from './ticker.js';
import Scraper from './scraper.js';

const ROOT_URL = 'https://www.investing.com';

export class InvestingScraper implements Scraper {

  httpClient: HttpClient;

  constructor({httpClient = defaultHttpClient()}) {
    this.httpClient = httpClient;
  }

  async getTicker(code: string): Promise<Ticker> {
    const url = await getPageLink(this.httpClient, code);
    console.log(`Scraping ${url}`);
    const {data} = await this.httpClient.get(url);
    const value = searchValueInBody(data);
    console.log(`Value: ${value}`);
    return new Ticker({currentValue: Number(value)});
  }
}

function searchValueInBody(body: string): string {
  const $ = cheerio.load(body);

  let tag = $('#last_last');
  if (tag?.text()) return tag.text();

  tag = $('[data-test=instrument-price-last]');
  if (tag?.text()) return tag.text();

  tag = $('.text-5xl');
  if (tag?.text()) return tag.text();

  if (process.env.FST_DEBUG) console.error(`Cannot find value in html body:\n${body}`);
  throw new Error('Cannot find relevant html tag in investing.com value page!');
}

async function getPageLink(httpClient: any, code: string) {
  const searchUrl = `${ROOT_URL}/search/?q=${code}`;
  console.log(`Search url: ${searchUrl}`);
  const {data} = await httpClient.get(searchUrl);
  const $ = cheerio.load(data);
  const tag = $('.searchSectionMain a');
  const link = tag?.attr('href');
  if (!link?.startsWith('/')) {
    console.error(`Extracted tag: ${tag}\nExtracted link: ${link}`);
    throw new Error('Cannot find result in investing.com search page!');
  }
  return ROOT_URL + link;
}

export default function (dependencies = {}) {
  return new InvestingScraper(dependencies);
}
