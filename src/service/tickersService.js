import defaultInvestingScraper from '@free-stock-tickers/scrapers/investing-scraper.js';

class TickersService {
  constructor({investingScraper = defaultInvestingScraper}) {
    this.investingScraper =investingScraper;
  }

  async findOne({ searchString }) {
    return await this.investingScraper.getCurrentValue(searchString);
  }
}

export default function(dependencies = {}) {
  return new TickersService(dependencies);
}
