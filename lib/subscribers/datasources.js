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

var datasources_add = function (ds) {
  joola.logger.info('New datasource added with the name ' + ds.name);
};

joola.dispatch.on('datasources', 'add', function (channel, message) {
  return datasources_add(message);
});

joola.dispatch.on('datasources', 'delete', function (channel, message) {
  console.log(channel, message);
});

joola.dispatch.on('datasources', 'update', function (channel, message) {
  console.log(channel, message);
});