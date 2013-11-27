var app = angular.module('joolaio', []);

joolaio.io.socket.on('datasources/update:done', function () {
  joolaio.io.socket.emit('datasources/list');
});

joolaio.io.socket.emit('datasources/list');
app.factory('socket', function ($rootScope) {
  var socket = joolaio.io.socket;
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

function dslist($scope, socket) {
  $scope.remove = function(datasource){
    joolaio.objects.datasources.delete({name:datasource.name}, function() {
      joolaio.io.socket.emit('datasources/list');
    });
  }
  socket.on('datasources/list:done', function (datasources) {
    $scope.datasources = datasources.datasources;
  });
}
