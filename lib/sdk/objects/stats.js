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

var stats = module.exports = [];
stats._id = 'stats';

stats.all = function (callback) {
  var self = this;
  joolaio.events.emit('stats.all.start');
  joolaio.api.fetch('/stats/all', function (err, result) {
    if (err)
      return callback(err);

    stats.splice(0, stats.length);
    Object.keys(result.datasources).forEach(function (key) {
      stats.push(result.datasources[key]);
    });

    joolaio.events.emit('stats.all.finish', self);
    return callback(null, self);
  });
};