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
  path = require('path'),
  fs = require('fs');

var sdk = exports;

sdk.index = function (req, res) {
  var jsContent;
  var filename = path.join(__dirname, '../sdk/bin/', 'joola.io.js');
  fs.readFile(filename, function read(err, data) {
    if (err) {
      throw err;
    }
    jsContent = data;

    res.setHeader('joola-token', req.token);
    res.setHeader('Content-Type', 'text/javascript');
    res.setHeader('Content-Length', jsContent.length);
    //res.setHeader('Last-Modified', result.timestamp);
    res.setHeader('Cache-Control', 'public, max-age=31557600');

    return res.send(jsContent);
  });
};