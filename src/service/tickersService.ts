import defaultInvestingScraper, {InvestingScraper} from '#free-stock-tickers/scrapers/investing-scraper.js';
import defaultYahooScraper, {YahooScrapper} from '#free-stock-tickers/scrapers/yahoo-scraper.js';

const YAHOO_CODE_REGEX = /^[A-Z]{2,5}(\.[A-Z]{2,5})?$/

class TickersService {

  investingScraper: InvestingScraper;
  yahooScraper: YahooScrapper;

  constructor({
    investingScraper = defaultInvestingScraper(),
    yahooScraper = defaultYahooScraper(),
  }) {
    this.investingScraper = investingScraper;
    this.yahooScraper = yahooScraper;
  }

  async findOne({ searchString }) {
    if (searchString.match(YAHOO_CODE_REGEX)) {
      return await this.yahooScraper.getCurrentValue(searchString);
    }
    return this.investingScraper.getCurrentValue(searchString);
  }
}

export default function(dependencies = {}) {
  return new TickersService(dependencies);
}
