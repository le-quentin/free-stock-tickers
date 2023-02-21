import httpClient from '../http/http-client.js';
import * as cheerio from 'cheerio';

const ROOT_URL = 'https://www.finance.yahoo.com';

function searchValueInBody(body) {
  const $ = cheerio.load(body);

  let tag = $('#quote-header-info [data-field="regularMarketPrice"]');
  if (tag?.attr('value')) return tag.attr('value');
  
  throw new Error('Couldn\'t find relevant html tag in yahoo.com page!');
}

async function getPageLink(code) {
  return `${ROOT_URL}/quote/${code}`
}

export default async function getCurrentValue(code) {
  const url = await getPageLink(code);
  console.log(`Scraping ${url}`);
  const {data} = await httpClient.get(url);
  const value = searchValueInBody(data);
  if (!value) {
    console.error(`Value: ${value}`);
    throw new Error('Cannot find stock value in yahoo.com page!');
  }
  console.log(`Value: ${value}`);
  return value;
}
