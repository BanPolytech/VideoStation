(function() {
	"use strict";
	
	todoApp.controller("loginCtrl", loginCtrl);
	
	loginCtrl.$inject = ["$rootScope", "$scope", "$location", "UserFactory"];
	
	function loginCtrl($rootScope, $scope, $location, UserFactory) {
		const vm = this;
		
		$scope.error = false;
		$scope.success = false;
		UserFactory.logout();
		$rootScope.logged = UserFactory.isLogged;
		//
		$scope.login = function login() {
            UserFactory.login($scope.username, $scope.pwd)
			.then(response => {
				$location.path("/");
			})
			.catch(error => {
				$scope.error = error;
			})
			.then(function() {
				$scope.$apply();
			});
        };
	}
	
})();
