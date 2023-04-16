import {Ticker} from "./ticker.js";

export default interface Scraper {
  getTicker(code: string): Promise<Ticker>;
}
