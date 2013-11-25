/**
 *  joola.io
 *
 *  Copyright Joola Smart Solutions, Ltd. <info@joo.la>
 *
 *  Licensed under GNU General Public License 3.0 or later.
 *  Some rights reserved. See LICENSE, AUTHORS.
 *
 *  @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 */

describe("require", function () {
  var version = require('../../../package.json').version;

  it("should have a version [" + version + "]", function () {
    expect(_sdk.VERSION).to.equal(version);
  });

  it("should have a valid config", function () {
    expect(_sdk.config).to.be.ok;
  });

  it("should have a valid api", function () {
    expect(_sdk.api).to.be.ok;
  });

  it("should have a valid events emitter", function () {
    expect(_sdk.events).to.be.ok;
  });

  it("should be able to emit/catch events", function (done) {
    _sdk.events.on('test:test:test', function () {
      return done(null);
    });
    _sdk.events.emit('test:test:test');
  });
});