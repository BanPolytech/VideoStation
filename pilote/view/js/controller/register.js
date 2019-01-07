(function() {
	"use strict";
	
	todoApp.controller("registerCtrl", registerCtrl);
	
	registerCtrl.$inject = ["$scope", "$location", "UserFactory"];
	
	function registerCtrl($scope, $location, UserFactory) {
		const vm = this;
		
		$scope.error = false;

		$scope.register = function register(){
            UserFactory.register($scope.username, $scope.pwd)
			.then(response => {
				$location.path("/login");
			})
			.catch(error => {
				$scope.error = error;
			})
			.then(function() {
				$scope.$apply();
			});
		}
	}
	
})();
