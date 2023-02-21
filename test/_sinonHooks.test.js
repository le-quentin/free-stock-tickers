import sinon from 'sinon';

beforeEach(function() {
  if (null == this.sinon) {
    console.log("Creating Sinon sandbox");
    this.sinon = sinon.createSandbox();
  } else {
    console.log("Restoring Sinon sandbox");
    this.sinon.restore();
  }
});
