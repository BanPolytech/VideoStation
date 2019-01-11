(function() {
	"use strict";
	
	todoApp.controller("loginController", loginController);
	
	loginController.$inject = ["$scope", "UserFactory", "$location"];
	
	function loginController($scope, UserFactory, $location, access) {
		const vm = this;
		
		vm.loginUser = function() {
			
			vm.loadingClass = "is-loading";
			
			UserFactory.login(vm.email, vm.password)
			.then(response => {
				$location.path("/home");
			})
			.catch(error => {
				vm.errorLogin = error;
			})
			.then(function() {
				vm.loadingClass = "";
				$scope.$apply();
			});
		};
		
		vm.goRegister = function() {
			$location.path("/register");
		};
	}
	
})();