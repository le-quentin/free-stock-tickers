import test from 'ava';
import app from '#free-stock-tickers/app.js';
import axiosMock from './mock/axios-mock.js';
import {HttpClient} from '#free-stock-tickers/http/http-client.js';
import axios from 'axios';
import { parse as parseCsv } from 'csv-parse/sync';

const APP_PORT = 42424;

test.before('Mock outbound calls', _t => {
	HttpClient.use(axiosMock());
});

test.before('Start application', _t => {
	process.env.APP_PORT = `${APP_PORT}`;
	return app.start();
});

const ROOT_URI = `http://localhost:${APP_PORT}`;

test('Get tickers - fetch META ticker (Yahoo)', async t => {
	const {status, data} = await axios.get(`${ROOT_URI}/tickers?searchString=META`);

	t.is(status, 200);
	const tickers = parseCsv(data, { columns: true });
	t.is(tickers.length, 1);
	t.deepEqual(tickers[0], { currentValue: '42.42' });
});
