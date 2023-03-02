export class Ticker {
  private readonly valueObject: true; // dummy flag to forbid implicit casting
  readonly currentValue: number;
  readonly name?: string;

  constructor(params: { currentValue: number, name?: string }) { 
    if (!params.currentValue || params.currentValue <= 0) throw new Error('Ticker must have a positive value!');
    Object.assign(this, params);
  }
}
