import test from 'ava';
import {Ticker} from '#free-stock-tickers/scrapers/ticker.js';

test('Build with all fields', t => {
    const ticker = new Ticker({currentValue: 42.42, name: 'name'});

    t.is(ticker.currentValue, 42.42);
    t.is(ticker.name, 'name');
});

test('Build without name', t => {
    const ticker = new Ticker({currentValue: 42.42});

    t.is(ticker.currentValue, 42.42);
    t.is(ticker.name, undefined);
});

[null, undefined, NaN, 0, -1].map(currentValue =>
    test(`Cannot build with invalid currentValue=${currentValue}`, t => {
        try {
            new Ticker({currentValue});
        } catch (err) {
            t.regex(err.message, /.*must have a positive value*/);
            return;
        }
        t.fail('Should have thrown');
    })
);
