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


describe("datasources", function () {
  it("should return a valid list of data sources", function (done) {
    _sdk.objects.datasources.list(function (err, datasources) {
      return done(err);
    })
  });
});