import test from 'ava';
import app from '#free-stock-tickers/app.js';
import axiosMock from './mock/axios-mock.js';
import {HttpClient} from '#free-stock-tickers/http/http-client.js';
import axios from 'axios';
import {parse as parseCsv} from 'csv-parse/sync';

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
	const tickers = parseCsv(data, {columns: true});
	t.is(tickers.length, 1);
	t.deepEqual(tickers[0], {name: 'Meta Platforms, Inc. (META)', currentValue: '42.42'});
});

test('Get tickers - fetch NL0006454928 "paper gold" ticker (Investing)', async t => {
	const {status, data} = await axios.get(`${ROOT_URI}/tickers?searchString=NL0006454928`);

	t.is(status, 200);
	const tickers = parseCsv(data, {columns: true});
	t.is(tickers.length, 1);
	t.deepEqual(tickers[0], {currentValue: '1337', name: ''});
});

test('Get tickers - fetch without searchString and get 400', async t => {
	return axios.get(`${ROOT_URI}/tickers`)
		.then(() => {
			t.fail('Should have been rejected');
		})
		.catch(({response: {status}}) => {
			t.is(status, 400);
		});
});

test('General - request unknown endpoint and get 404', async t => {
	return axios.get(`${ROOT_URI}/completely-unknown`)
		.then(() => {
			t.fail('Should have been rejected');
		})
		.catch(({response: {status}}) => {
			t.is(status, 404);
		});
});

test('General - app is still running after a 500', async t => {
	return axios.get(`${ROOT_URI}/tickers?searchString=completely-unknown-code-that-has-0-chance-to-fetch`)
		.then(() => {
			t.fail('Should have been rejected');
		})
		.catch(async ({response: {status}}) => {
			t.is(status, 500);
			const {status: secondCallStatus} = await axios.get(`${ROOT_URI}/tickers?searchString=META`);
			t.is(secondCallStatus, 200);
		});
});

