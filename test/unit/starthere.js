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

before(function (done) {
  this.timeout = 50000;
  _joolaio = require('../../joola.io.manage.js');
  _joolaio.events.on('init:done', function () {
    _sdk = require('../../lib/sdk/index');
    var options = {
      isBrowser: false,
      debug: {
        enabled: false,
        events: {
          enabled: false,
          trace: false
        },
        functions: {
          enabled: false
        }
      }
    };
    _sdk.init(options, function (err) {
      if (err)
        throw err;
      return done();
    });
  });


});

after(function (done) {
  done();
});
