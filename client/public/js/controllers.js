'use strict';

function getWarriorsController(apiUrl) {
	return function($scope, $http) {
		
		function getall_warriors() {
	  		$http.get(apiUrl, {
				    params: { 
				    	page: $scope.currentPage ,
				    	limit: $scope.numPerPage
				    }
				}).
				success(function(data) {
					$scope.warriors = data.items;
					$scope.count = data.itemCount;
				}).
				error(function(data) {
					console.log('Error: ' + data);
				});
	  	}
	  	
		$scope.warriors= [];
	  	$scope.currentPage = 1;
	  	$scope.numPerPage = 20;
	  	$scope.maxSize = 5;
	  	$scope.count = 0;
			
		$scope.$watch("currentPage + numPerPage", function() {
			getall_warriors();
		});
		
		$scope.$watch('search', function (query) {
			
			if (query) {
		        $http.get(apiUrl + '/search/' + query, {
				    params: { 
				    	page: $scope.currentPage ,
				    	limit: $scope.numPerPage
				    }
				}).
				success(function(data) {
					$scope.warriors = data.items;
					$scope.count = data.itemCount;
				}).
				error(function(data) {
					console.log('Error: ' + data);
				});
			} else {
				getall_warriors();
			}
		    
		});
	};
};

var jwmww2Controllers = angular.module('jwmww2Controllers', []);

jwmww2Controllers.controller('WarriorListCtrl', ['$scope', '$http', getWarriorsController('/api/warrior')]);
 
  
jwmww2Controllers.controller('WarriorDetailCtrl', ['$scope', '$http', '$routeParams', 'Country',
  function($scope, $http, $routeParams, Phone) {

	$scope.availableCountries = Phone.query();
		
	$http.get('/api/warrior/' + $routeParams.warriorId )
		.success(function(data) {
			$scope.warrior = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
}]);
  
jwmww2Controllers.controller('AddWarriorCtrl', ['$scope', '$http',
  function($scope, $http) {

	// when submitting the add form, send the text to the node API
	$scope.addWarrior = function() {
	
		$http.post('/api/warrior', $scope.warrior)
			.success(function(data) {
				$scope.warrior = {}; // clear the form so our user is ready to enter another
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
		
}]);

jwmww2Controllers.controller('WarriorAdminCtrl', ['$scope', '$http',
  function($scope, $http) {
  	
  	/*// when landing on the page, get all warriors and show them
	$http.get('/api/admin/warrior')
		.success(function(data) {
			$scope.warriors = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});*/
	getWarriorsController('/api/admin/warrior')($scope,  $http);

	$scope.publishWarrior = function(id) {

		$http.put('/api/admin/warrior/publish/' + id)
			.success(function(data) {
				$scope.warriors = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	// delete a todo after checking it
	$scope.deleteWarrior = function(id) {
		$http.delete('/api/admin/warrior/' + id)
			.success(function(data) {
				$scope.warriors = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
		
}]);

jwmww2Controllers.controller('LoginCtrl', ['$http', '$scope',
  function($http, $scope) {
  	
	$scope.login = function() {
	
		$scope.showMessage = false;
	
		$http.post('/api/login', {
                email: this.email,
                password: this.password
            })
			.success(function(data) {
				// server will redirect on success	
			})
			.error(function(data) {
				$scope.message = data.error;
				$scope.showMessage = true;
			});
	};
}]);

jwmww2Controllers.controller('HeaderController', ['$scope', '$location',
  function($scope, $location) {

	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };	
		
}]);
  

 
