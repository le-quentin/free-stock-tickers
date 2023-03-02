abstract class ValueObject<T extends object> {
  constructor(params: T) {
    this.validate(params);
    Object.assign(this, params);
  }

  protected abstract validate(params: T): void;
}

class TickerParams {
  readonly currentValue: number;
  readonly name?: string;
}

export class Ticker extends ValueObject<TickerParams>{
  readonly currentValue: number;
  readonly name?: string;

  validate(params: TickerParams) {
    if (!params.currentValue || params.currentValue <= 0) throw new Error('Ticker must have a positive value!');
  }
}
