'use strict';

// Declare app level module which depends on filters, and services

angular.module('ngjoola', [
  'ngRoute',
  'ngjoola.controllers',
  'ngjoola.filters',
  'ngjoola.services',
  'ngjoola.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    when('/', {
      //templateUrl: 'partials/partial2',
      controller: 'homepageCtrl'
    }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
