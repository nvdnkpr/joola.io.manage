'use strict';

/* Controllers */

angular.module('ngjoola.controllers', []).
  controller('AppCtrl',function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
      success(function (data, status, headers, config) {
        $scope.name = data.name;
      }).
      error(function (data, status, headers, config) {
        $scope.name = 'Error!'
      });

  }).

  controller('homepageCtrl',function ($scope) {
    $scope.name = 'test';

  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });
