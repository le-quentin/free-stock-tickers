import defaultInvestingScraper, {InvestingScraper} from '#free-stock-tickers/scrapers/investing-scraper.js';
import {Ticker} from '#free-stock-tickers/scrapers/ticker.js';
import defaultYahooScraper, {YahooScraper} from '#free-stock-tickers/scrapers/yahoo-scraper.js';

const YAHOO_CODE_REGEX = /^[A-Z]{2,5}(\.[A-Z]{2,5})?$/

class TickersService {

  investingScraper: InvestingScraper;
  yahooScraper: YahooScraper;

  constructor({
    investingScraper = defaultInvestingScraper(),
    yahooScraper = defaultYahooScraper(),
  }) {
    this.investingScraper = investingScraper;
    this.yahooScraper = yahooScraper;
  }

  async findOne(searchString: string): Promise<Ticker> {
    if (searchString.match(YAHOO_CODE_REGEX)) {
      return await this.yahooScraper.getTicker(searchString);
    }
    return this.investingScraper.getTicker(searchString);
  }
}

export default function(dependencies = {}) {
  return new TickersService(dependencies);
}
