import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function getCurrentValue(_code) {
  return axios.get('https://www.investing.com/etfs/lyxor-euro-corporate-bond')
    .then(({data}) => {
      console.log(data);
      const $ = cheerio.load(data);
      const tag = $('#last_last');
      const value = tag.text();
      console.log(`Tag: ${tag}\nValue: ${value}`);
      return value;
    });
}
