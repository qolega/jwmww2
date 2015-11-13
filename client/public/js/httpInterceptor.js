/*
    Factory that listens to all responses from GET/POST and pre-processes it
    * If data.redirect is present, perform a redirect with angular (Hash redirect)
    * If data.error is present, display growl errors
*/
(function() {
    angular.module('httpFactory', [])
        .factory('myHttpResponseInterceptor', ['$q','$location', function($q,$location){
            return {
                response: function(response) {
                    if (typeof response.data === 'object') {
                        if (response.data.redirect) {
                            $location.path(response.data.redirect);
                            $location.replace();
                        } 
                    }
                    return response;
                }
            };
        }])
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('myHttpResponseInterceptor');
        }]);
})();