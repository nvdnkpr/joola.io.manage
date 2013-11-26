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

global.__name = __name = 'joola.io.manage';

var
  logger = require('joola.io.logger'),
//mongo = require('./lib/joola.io.logger/mongo'),
  router = require('./lib/routes/index'),

  domain = require('domain'),

  fs = require('fs'),
  nconf = require('nconf'),
  path = require('path'),
  http = require('http'),
  https = require('https'),
  express = require('express'),

  Dispatch = require('./lib/dispatch'),
  dgram = require('dgram');

require('nconf-redis');

var _ = global._ = require('underscore');

nconf.argv()
  .env();

var options_redis = {
  host: 'db.joola.io',
  port: 6379,
  DB: 0
};
var options_server = {
  port: 40008,
  securePort: null
};

nconf.use('redis', { host: options_redis.host, port: options_redis.port, ttl: 0, db: options_redis.DB });

var app = global.app = express();
var udpserver = dgram.createSocket("udp4");
var io;

var joola = {};
global.joola = module.exports = joola;

joola.logger = logger;
joola.io = io;
joola.config = nconf;
joola.redis = joola.config.stores.redis.redis;
joola.events = require('./lib/common/events');
joola.dispatch = new Dispatch({});
joola.common = require('./lib/common');
joola.sdk = require('./lib/sdk');
joola.stats = null; //require('./lib/common/stats');

joola.domain = process.domain = domain.create();
joola.domain.on('error', function (domain, err) {
  joola.logger.error('Domain error! ' + err.message);

  console.log(err);
  console.trace();

  joola.logger.debug(err.stack);
});

joola.redis.incr('stats:' + __name + ':appStart');
joola.redis.on('error', function (err) {
  console.log('ERROR', err);
});

/*
 joola.redis.keys('locks:channels:once:*', function (err, list) {
 list.forEach(function (lock) {
 joola.redis.del(lock);
 })
 });
 */

nconf.set('version', require('./package.json').version, function (err) {
  if (err)
    throw err;

  nconf.get('version', function (err, value) {
    //  console.log('version', value);
  });
});
//console.log('before save redis');
nconf.set('redis', options_redis, function (err) {
  //console.log('saved redis');
  if (err)
    throw err;
  nconf.get('redis', function (err, value) {
    // console.log('redis', value);
  });
});
nconf.set('server', options_server);
var port, secureport;

var loadConfiguration = function (callback) {
  joola.events.emit('loadConfiguration');
  joola.config.get('version', function (err, value) {
    if (err)
      throw err;

    if (!value)
      throw new Error('Failed to load configuration.');

    //console.log('Redis configuration stored valid.');
    joola.config.get('server:port', function (err, value) {
      if (err)
        throw err;

      //console.log('server:port', value);
      port = value;

      joola.config.get('server:securePort', function (err, value) {
        if (err)
          throw err;
        secureport = value;
        return callback(null);
      });
    });
  });
};

loadConfiguration(function () {
  joola.events.emit('loadConfiguration:done');
  //console.log('config loaded');
//Application settings
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon('public/assets/ico/favicon.ico'));
  app.use(express.compress());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  /*app.use(express.session({
   secret: 'what-should-be-the-secret?',
   maxAge: new Date(Date.now() + 3600000), //1 Hour
   expires: new Date(Date.now() + 3600000) //1 Hour
   }));*/
  app.use(require('joola.io.status')({baseDir: __dirname}));

//Logger

  /*
   var winstonStream = {
   write: function (message, encoding) {
   joola.logger.info(message);
   }
   };
   app.use(express.logger((global.test ? function (req, res) {
   } : {stream: winstonStream})));
   */

  //app.use(require('joola.io.auth')(joola.config.get('auth')));
  app.use(express.logger(function (req, res) {
  }));
//Routes
//app.get('/', router.index);
//app.post('/save', router.save);

//Service Start/Stop & Control Port
  var status = '';
  var httpServer, httpsServer;

  var startHTTP = function (callback) {
    var result = {};
    try {
      var _httpServer = http.createServer(app).listen(port,function (err) {
        if (err) {
          result.status = 'Failed: ' + ex.message;
          return callback(result);
        }
        status = 'Running';
        joola.logger.info('joola.io logging HTTP server listening on port ' + port);
        result.status = 'Success';
        httpServer = _httpServer;
        return callback(result);
      }).on('error',function (ex) {
          result.status = 'Failed: ' + ex.message;
          return callback(result);
        }).on('close', function () {
          status = 'Stopped';
          joola.logger.warn('joola.io logging HTTP server listening on port ' + port.toString() + ' received a CLOSE command.');
        });
    }
    catch (ex) {
      result.status = 'Failed: ' + ex.message;
      console.log('Error1');
      console.log(result.status);
      console.log(ex.stack);
      return callback(result);
    }
    return null;
  };

  var startSocketIO = function (callback) {
    var socketioWildcard = require('socket.io-wildcard');
    joola.io = io = socketioWildcard(require('socket.io')).listen(httpServer, { log: false });
    io.set('log level', 0);
    io.sockets.on('connection', function (socket) {
      socket.on('*', function (event) {
        var req = {};
        req.query = {};
        req.params = event.args || {};
        req.params.resource = event.name.split('/')[0];
        req.params.action = event.name.split('/')[1];
        req.url = '';

        var res = {};
        res.status = function (statuscode) {

        };
        res.json = function (json) {
          return socket.emit(event.name + ':done', json);
        };

        return router.route(req, res);
      })
    });
    return callback();
  };

  var setupRoutes = function (callback) {
    try {
      var
        index = require('./lib/routes/index');

      app.configure(function () {
        app.use(function (req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'joola-token, Content-Type, origin');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('X-Powered-By', 'joola.io');

          return next();
        });
      });
      app.use(express.static(path.join(__dirname, 'assets')));
      app.get('/', index.index);

      app.get('/joola.io.js', index.sdk);
      app.get('/configure', index.configure);
      app.get('/logger', index.logger);

      app.get('/:resource', index.route);
      app.get('/:resource/:action', index.route);
      app.use(app.router);

      //TODO: Setup 500 and 404 routes


      return callback(null);
    }
    catch (err) {
      joola.logger.error('setupRoutes: ' + err);
      return callback(err);
    }
  };

  var setupSubscribers = function (callback) {
    require('./lib/subscribers/index');

    return callback(null);
  };

  setupRoutes(function () {
    setupSubscribers(function () {
      startHTTP(function () {
        startSocketIO(function () {
          joola.stats = require('./lib/common/stats');
          joola.events.emit('init:done');
        });
      });
    });
  });
});
