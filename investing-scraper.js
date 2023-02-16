import axios from 'axios';
import * as cheerio from 'cheerio';

const ROOT_URL = 'https://www.investing.com';

function getPageLink(code) {
  const searchUrl = `${ROOT_URL}/search/?q=${code}`;
  console.log(`Search url: ${searchUrl}`);
  return axios.get(searchUrl)
    .then(({data}) => {
      const $ = cheerio.load(data);
      const tag = $('.searchSectionMain a');
      const link = tag?.attr('href');
      if (!link?.startsWith('/')) {
        console.error(`Extracted tag: ${tag}\nExtracted link: ${link}`);
        throw new Error('Cannot find result in investing.com search page!');
      }
      return ROOT_URL + link;
    });
}

export default function getCurrentValue(code) {
  return getPageLink(code)
    .then(url => {
      console.log(`Scraping ${url}`);
      return axios.get(url);
    })
    .then(({data}) => {
      const $ = cheerio.load(data);
      const tag = $('#last_last');
      const value = tag.text();
      if (!value) {
        console.error(`Tag: ${tag}\nValue: ${value}`);
        throw new Error('Cannot find stock value in investing.com page!');
      }
      console.log(`Value: ${value}`);
      return value;
    });
}
