'use strict';

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

/* App Module */

var jwmww2App = angular.module('jwmww2App', [
  'ngRoute',
  'jwmww2Services',
  'jwmww2Controllers',
  'jwmww2Filters',
  'httpFactory',
  'ui.bootstrap'
]);

jwmww2App.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider.
      when('/warrior', {
        templateUrl: 'partials/warrior-list',
        controller: 'WarriorListCtrl'
      }).
      when('/warrior/:warriorId', {
        templateUrl: 'partials/warrior-details',
        controller: 'WarriorDetailCtrl'
      }).
      when('/addwarrior', {
        templateUrl: 'partials/warrior-add',
        controller: 'AddWarriorCtrl'
      }).
      when('/admin/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      }).
      when('/admin/signup', {
        templateUrl: 'partials/signup',
        controller: 'LoginCtrl'
      }).
      when('/admin/warrior', {
        templateUrl: 'partials/warrior-admin',
        controller: 'WarriorAdminCtrl'
      }).
      otherwise({
        redirectTo: '/warrior'
      });
      
}]);