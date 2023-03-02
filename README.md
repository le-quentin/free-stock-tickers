# free-stock-tickers 📈
Ask for a stock, receive its live price information, in CSV format. Plain. Simple. Free.

*Built for both AMD64 💻 and ARM-v7! 🍇*

## But... why?

I'm building some spreadsheets to help me manage my stocks portfolio. I needed a way to get live stock data. And for some reason, it felt weird to me to pay money in order to build my portfolio management tool... So I came up with this simple web scraping solution!

Since I intended it to be used in spreadsheets, the API replies in CSV format.

Warning: As with any web scraping based solution, there's no stability guarantee, and the functionality will break if scraped website do an important update of their html structure. I tried to use relevant stuff like semantic attributes and ids, things that shouldn't change often; but there's still no guarantee it won't break at some point, so be warned.

## Usage 

Once the API is deployed, you can query its one endpoint as such:

```sh
$> curl http://<host>:<port>/tickers?searchString=<string>
```

### Examples:

- `/tickers?searchString=META` => the Facebook ticker
- `/tickers?searchString=MC.PA` => the LVMH ticker
- `/tickers?searchString=LU1829219127` => Amundi ETF Euro Corporate Bond ticker

### Details: 

For searchString, you should provide:
- When possible (most common use case), the stock symbol: for example `META` for Facebook. If the stock isn't american, you must also provide the index symbol: for example, `MC.PA` for LVMH, France. If you're not sure about what to provide, search for your stock in `finance.yahoo.com`, the complete symbol will appear in your stock's page URL.
- When your product doesn't have a symbol, and/or isn't listed in `finance.yahoo.com` (which might be the case for some ETF, or some niche non-stock products), provide the ISIN code instead.

## Deploy

If you just wanna use it without any modification, you can simply use the docker image. For example, to run the latest version on the local port 80: 

```sh
$> docker run -p 80:3000 ghcr.io/le-quentin/free-stock-tickers:latest 
```

If for some reason you need to specify the server's port, you can do it with the `APP_PORT` env var:

```sh
$> docker run -e APP_PORT=80 -p 80:80 ghcr.io/le-quentin/free-stock-tickers:latest 
```

If you want to use a specific version, check out your version's tag in this repository packages (recommended if you really want stability, since I don't make releases, and every push to `master` branch publishes a new docker image).

## Build the service  

If you want to build the service yourself (to modify it/extend it, or for whatever reason), you will need those:

- NodeJS >= `18.14.0` 
- Yarn >= `1.22.19`

I advise you to use [nvm](https://github.com/nvm-sh/nvm), it's awesome. Then the setup is pretty straightforward:

```
$> nvm use
$> npm install --global yarn
$> yarn install
$> yarn build
$> yarn start
```

You can look into `package.json` for more scripts, they're all pretty self explanatory: `yarn test` will run all tests, `yarn watch` will run the app in watch mode.

If you need to build a docker image for your version, once again it's very straightforward, simply use the provided `Dockerfile`: 

```
$> docker build .
```

The project uses Github Actions to automatically publish new versions whenever I push; if you forked this project, you will need to either adapt the scripts under `.github/workflows` to work with your own repository, or remove the folder if you don't wanna use this feature.

## Todo - things I might change/add 
- [x] use Yarn
- [x] /tickers?searchString=XXX route, scraping investing or yahoo depending of the format of the string
- [x] Return ticker name (useful to check if we did fetch the right ticker)
- [ ] Use a cache, if failing to get value, return last known (add valueTime to the return)
- [ ] Profiling => if cheerio bottleneck, then worker threads?
- [ ] Integration tests for scrapers (useful to notify if website has breaking changes)
- [x] Add tests in Github CI/CD
- [ ] Run tests in Github daily, with email notification if failure?
