import httpClient from '../http/http-client.js';
import * as cheerio from 'cheerio';

const ROOT_URL = 'https://www.investing.com';

function searchValueInBody(body) {
  const $ = cheerio.load(body);

  let tag = $('#last_last');
  if (tag?.text()) return tag.text();
  
  tag = $('[data-test=instrument-price-last]');
  if (tag?.text()) return tag.text();

  throw new Error('Couldn\'t find relevant html tag in investing.com page!');
}

async function getPageLink(code) {
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

export default async function getCurrentValue(code) {
  const url = await getPageLink(code);
  console.log(`Scraping ${url}`);
  const {data} = await httpClient.get(url);
  const value = searchValueInBody(data);
  if (!value) {
    console.error(`Value: ${value}`);
    throw new Error('Cannot find stock value in investing.com page!');
  }
  console.log(`Value: ${value}`);
  return value;
}
