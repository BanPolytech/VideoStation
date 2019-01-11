(function() {
	"use strict";
	
	todoApp.config(["$routeProvider", function($routeProvider) {
		$routeProvider
		.when("/login", {
			title: 'Login',
			templateUrl: "template/login.html",
			controller: "loginController",
			controllerAs: "vm",
			resolve: {
				access: ["Access", function (Access) { return Access.isAnonymous(); }],
			}
		})
		.when("/register", {
			title: 'Register',
			templateUrl: "template/register.html",
			controller: "registerController",
			controllerAs: "vm",
			resolve: {
				access: ["Access", function (Access) {
					return Access.isAnonymous();
				}],
			}
		})
		.when("/home", {
			title: 'My lists',
			templateUrl: "template/home.html",
			controller: "homeController",
			controllerAs: "vm",
			resolve: {
				access: ["Access", function (Access) { return Access.isAuthenticated(); }],
			}
		})
		.when("/list/:id", {
			title: 'List of task',
			templateUrl: "template/list.html",
			controller: "listController",
			controllerAs: "vm",
			resolve: {
				access: ["Access", function (Access) { return Access.isAuthenticated(); }],
			}
		})
		.otherwise({ redirectTo: "/home" });
	}]);
	
})();
