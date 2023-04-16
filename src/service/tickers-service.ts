import defaultInvestingScraper from '#free-stock-tickers/scrapers/investing-scraper.js';
import defaultYahooScraper from '#free-stock-tickers/scrapers/yahoo-scraper.js';
import Scraper from '#free-stock-tickers/scrapers/scraper.js';
import {Ticker} from '#free-stock-tickers/scrapers/ticker.js';
import ScraperRetryDecorator from '#free-stock-tickers/scrapers/retry-scraper-decorator.js';

const YAHOO_CODE_REGEX = /^[A-Z][A-Z0-9]{1,4}(\.[A-Z]{2,5})?$/

class TickersService {

  private investingScraper: Scraper;
  private yahooScraper: Scraper;

  constructor(dependencies) {
    this.investingScraper = dependencies.investingScraper;
    this.yahooScraper = dependencies.yahooScraper;
  }

  async findOne(searchString: string): Promise<Ticker> {
    if (searchString.match(YAHOO_CODE_REGEX)) {
      return await this.yahooScraper.getTicker(searchString);
    }
    return this.investingScraper.getTicker(searchString);
  }
}

export default function (dependencies: {investingScraper: Scraper, yahooScraper: Scraper} = {
  investingScraper: new ScraperRetryDecorator(defaultInvestingScraper(), 3),
  yahooScraper: new ScraperRetryDecorator(defaultYahooScraper(), 3),
}) {
  return new TickersService(dependencies);
}
