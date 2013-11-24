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
  url = require('url'),
  connector = require('../connectors/connector');

var list = function (persist) {
  var datasources = [];
  _.each(joola.config.integration.datasources, function (ds) {
    datasources.push(ds);
  });

  if (persist)
    return datasources;
  else
    return ce.clone(datasources);
};

var get = function (datasourceid, persist) {
  var datasource = _.find(list(false), function (ds) {

    return ds.id.toLowerCase() == datasourceid.toLowerCase();
  });

  if (!datasource)
    return null;

  if (persist)
    return datasource;
  else
    return ce.clone(datasource);
};

var validate = function (datasourceid, callback) {
  var datasource = get(datasourceid);
  var query = connector.createQuery();

  query.sql = 'SELECT 1;';
  query.limit = 1;
  query.datasource = datasource;
  connector.executeQuery(query, function (query, rows, fields, err) {
    if (err)
      return callback(err);

    return callback(null, true);
  });
};

exports.list = list;
exports.get = get;
exports.validate = validate;
