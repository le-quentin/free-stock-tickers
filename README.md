# free-stock-tickers
Freely fetch live stock data by scraping web pages

## Todo 
- [x] Yarn for modules management
- [ ] /tickers?searchString=XXX route, scraping investing or yahoo depending of the format of the string
- [ ] Use a cache, if failing to get value, return last known (add valueTime to the return)
- [ ] Profiling => if cheerio bottleneck, then worker threads?
- [ ] Integration tests for scrapers (useful to notify if website has breaking changes)
- [ ] Add tests in Github CI/CD
- [ ] Run tests in Github daily, with email notification if failure?
