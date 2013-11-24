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

var
  datasources = require('../objects/datasources');

joola.dispatch.once('datasources', 'list-request', function (channel, ds) {
  joola.logger.info('Listing data sources');
  return datasources.list();
});

joola.dispatch.once('datasources', 'list-done', function (channel, ds) {
  joola.logger.info('Datasource list sent');
});

joola.dispatch.once('datasources', 'add-request', function (err, ds) {
  joola.logger.info('New datasource request [' + ds.name + ']');
  return datasources.add(ds);
});

joola.dispatch.once('datasources', 'add-done', function (err, ds) {
  if (err)
    return joola.logger.error('Failed to add datasource: ' + err);

  joola.io.sockets.emit('datasources/update:done', ds);

  joola.logger.info('New datasource added [' + ds.name + ']');
});

joola.dispatch.on('datasources', 'delete', function (channel, ds) {
  joola.logger.info('Deleted datasource with the name ' + ds.name);
});

joola.dispatch.on('datasources', 'update', function (channel, ds) {
  joola.logger.info('Update datasource with the name ' + ds.name);
});

