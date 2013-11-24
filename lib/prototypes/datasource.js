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

var proto = {
  "name": {
    "name": "name",
    "description": "The name of the datasource",
    "type": "string",
    "required": true
  },
  "type": {
    "name": "type",
    "description": "The type of the datasource (mysql/postgres/etc)",
    "required": true
  },
  "stam": {
    "name": "stam",
    "description": "The stam param",
    "required": false
  }
};

var Datasource = module.exports = function (options) {
  Object.keys(proto).forEach(function (key) {
    if (proto[key].required && (!options.hasOwnProperty(key) || (options.hasOwnProperty(key) && !options[key]))) {
      throw new Error('Failed to verify key [' + key + '] in new datasource');
    }
  });

  return options;
};

Datasource.proto = proto;