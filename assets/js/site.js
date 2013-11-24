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

var socket = io.connect('http://localhost');
socket.on('datasources/list:done', function (data) {
  console.log(data);
});

socket.on('datasources/update:done', function (data) {
  console.log(data);
});

setTimeout(function(){
  socket.emit('datasources/list');
},1000);