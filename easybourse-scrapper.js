import axios from 'axios';
import * as cheerio from 'cheerio';

/*
  * Doesn't work as is because the website is using sockets to fetch the value asynchronously...
  * See how to do it the same way, or use another website
  */
export default function getCurrentValue(_code) {
  return axios.get('https://www.easybourse.com/trackers/LU1829219127-25/lyxor-esg-euro-cor')
    .then(({data}) => {
      console.log(data);
      const $ = cheerio.load(data);
      const tag = $('#x_cours_dernier');
      const value = tag.attr("brutlivecotation");
      console.log(`Tag: ${tag}\nValue: ${value}`);
      return value;
    });
}
