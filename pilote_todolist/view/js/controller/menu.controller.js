(function() {
	"use strict";
	
	todoApp.controller("menuController", menuController);
	
	menuController.$inject = ["$scope", "$location", "UserFactory"];
	function menuController($scope, $location, UserFactory) {
		const vm = this;
		
		$scope.$watch(
			function() {
				return UserFactory.isLogged;
			},
			function(newVal, oldVal) {
				$scope.isLogged = newVal;
			}
		);

		vm.goHome = function() {
      		$location.path("/");
    	};
		
		vm.goLogin = function() {
			$location.path("/login");
		};
		
		vm.goRegister = function() {
			$location.path("/register");
		};
		
		vm.logoutUser = function() {
			UserFactory.logout();
			vm.goLogin();
		};
		
	}
})();
