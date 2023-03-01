# free-stock-tickers
Freely fetch live stock data by scraping web pages

## Todo 
- [x] Yarn for modules management
- [x] /tickers?searchString=XXX route, scraping investing or yahoo depending of the format of the string
- [ ] Return ticker name (useful to check if we did fetch the right ticker)
- [ ] Use a cache, if failing to get value, return last known (add valueTime to the return)
- [ ] Profiling => if cheerio bottleneck, then worker threads?
- [ ] Integration tests for scrapers (useful to notify if website has breaking changes)
- [x] Add tests in Github CI/CD
- [ ] Run tests in Github daily, with email notification if failure?
