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

var redis = require('redis');

var Events = module.exports = function (options) {
  var self = this;

  options = options || {};
  this.namespace = options.namespace || 'joola.io';
  this.host = options.host || 'localhost';
  this.port = options.port || 6379;
  this.db = options.db || 0;
  this.publisher = redis.createClient(options.port, options.host);
  this.subscriber = redis.createClient(options.port, options.host);
  this.subscribed = false;
  this.channels = [];

  this.publisher.select(this.db);
  this.subscriber.select(this.db);

  if (options.auth) {
    this.publisher.auth(options.auth);
    this.subscriber.auth(options.auth);
  }

  // Suppress errors from the Redis client
  this.publisher.on('error', function (err) {
    console.dir(err);
  });
  this.subscriber.on('error', function (err) {
    console.dir(err);
  });

  return this;
};

Events.prototype.emit = function (namespace, message, details, callback) {
  var channel = namespace + ':' + message;
  /*
   if (this.channels.indexOf(channel) == -1) {
   console.log('[emit] subscribed to channel [' + channel + ']');
   this.subscriber.subscribe(channel);
   this.channels.push(channel);
   }*/

  console.log('[emit] ' + channel, details);

  return this.publisher.publish(channel, details);
};

Events.prototype.on = function (namespace, message, callback) {
  var channel = namespace + ':' + message;

  if (this.channels.indexOf(channel) == -1) {
    console.log('[on] subscribed to channel [' + channel + ']');
    this.subscriber.subscribe(channel);
    this.channels.push(channel);
  }

  if (!this.subscribed) {
    this.subscribed = true;
    this.subscriber.on('message', function (channel, message) {
      console.log('message', channel);
      if (channel == namespace + ':' + message)
        return callback(channel, message);
    });
  }
};