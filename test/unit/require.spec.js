"use strict";
describe("require", function () {
  var joolaio;
  var version = require('../../package.json').version;

  before(function (done) {
    joolaio = require('../../lib/sdk/');
    return done();
  });

  it("should have a version [" + version + "]", function () {
    expect(joolaio.VERSION).to.equal(version);
  });

  it("should have expect defined", function () {
    expect(expect).to.be.ok;
  });

  it("should have underscore defined", function () {
    expect(_).to.be.ok;
  });
});