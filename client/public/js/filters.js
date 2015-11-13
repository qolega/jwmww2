'use strict';

/* Filters */

angular.module('jwmww2Filters', []).filter('countryName', function() {
  return function(input) {
    return input.name;
  };
});