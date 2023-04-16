import * as retry from '#free-stock-tickers/scrapers/retry-scraper-decorator.js';
import test from 'ava';
import sinon from 'sinon';

class TestClass {
    async methodResolvesNumber(_a: number, _b: string) {
        return 0;
    }
    async methodResolvesVoid() {
    }
}

[...Array(10).keys()].map(maxAttempts => test(`Retry ${maxAttempts} times and fail`, t => {
    const stub = sinon.createStubInstance(TestClass);
    const err = sinon.createStubInstance(Error);
    stub.methodResolvesNumber.rejects(err);
    const withRetry = new retry.RetryDecorator(stub, stub.methodResolvesNumber, maxAttempts);

    return withRetry.methodResolvesNumber(1, 'toto')

        .then(() => t.fail('Should have been rejected'))
        .catch((thrown: Error) => {
            sinon.assert.alwaysCalledWith(stub.methodResolvesNumber, 1, 'toto');
            t.is(stub.methodResolvesNumber.getCalls().length, Math.max(maxAttempts, 1));
            t.is(thrown, err);
        });
}));


test('Retry twice then pass', t => {
    const stub = sinon.createStubInstance(TestClass);
    const err = sinon.createStubInstance(Error);
    stub.methodResolvesNumber.onFirstCall().rejects(err);
    stub.methodResolvesNumber.onSecondCall().rejects(err);
    stub.methodResolvesNumber.onThirdCall().resolves(42);
    const withRetry = new retry.RetryDecorator(stub, stub.methodResolvesNumber, 3);

    return withRetry.methodResolvesNumber(1, 'toto')

        .then((result: number) => {
            sinon.assert.calledThrice(stub.methodResolvesNumber);
            sinon.assert.alwaysCalledWith(stub.methodResolvesNumber, 1, 'toto');
            t.is(result, 42);
        });
});

test('Pass on first try', t => {
    const stub = sinon.createStubInstance(TestClass);
    stub.methodResolvesVoid.onFirstCall().resolves();
    const withRetry = new retry.RetryDecorator(stub, stub.methodResolvesVoid, 3);

    return withRetry.methodResolvesVoid()

        .then((result: any) => {
            sinon.assert.calledOnce(stub.methodResolvesVoid);
            sinon.assert.alwaysCalledWith(stub.methodResolvesVoid);
            t.assert(result === undefined);
        });
});

