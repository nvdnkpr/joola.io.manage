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



setInterval(function () {
  joolaio.io.socket.emit('datasources/list');
}, 0);


joolaio.io.socket.on('stats:events', function (value) {
  $('.stats-eps').text(value);
});

