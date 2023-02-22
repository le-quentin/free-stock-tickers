# free-stock-tickers
Freely fetch live stock data by scraping web pages

## Todo 
- [x] Yarn for modules management
- [ ] /tickers?ISIN=XXX&code=... route, fetching Yahoo with codes, Investing.com with ISIN (unless Yahoo handles ISIN too? It would need an additional search)
- [ ] Use a cache, if failing to get value, return last known (add valueTime to the return)
- [ ] Profiling => if cheerio bottleneck, then worker threads?
- [ ] Integration tests for scrapers (useful to notify if website has breaking changes)
- [ ] Add tests in Github CI/CD
- [ ] Run tests in Github daily, with email notification if failure?
