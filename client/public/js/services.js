var jwmww2Services = angular.module('jwmww2Services', ['ngResource']);

jwmww2Services.factory('Country', ['$resource',
  function($resource){
    return $resource('/api/countries', {}, {
    });
  }]);