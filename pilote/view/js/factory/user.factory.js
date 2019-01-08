(function() {
	"use strict";
	
	todoApp.factory("UserFactory", UserFactory);
	
	UserFactory.$inject = ["appAPI", "$rootScope"];
	
	function UserFactory(appAPI, $rootScope) {
		
		const apiEndpoint = "user/";
		var loggedState = false;
		var adminState = false;
		
		function makeEndpoint(method) {
			return `${apiEndpoint}${method}`;
		}
		
		const services = { 
			login,
			logout,
			register,
			get isLogged() {
				return loggedState;
			},
            get isAdmin() {
                return adminState;
            },
			verify
		};
		
		return services;

		function login(email, password) {
			return appAPI.post(makeEndpoint('login'), {
				email: email,
				password: password
			})
			.then(response => {
				logged(response.token);
				setAdmin(response.admin);
				return Promise.resolve("Success!");
			})
			.catch(error => {
				switch (error) {
					case "USER_NOT_EXIST":
					return Promise.reject("The user does not exist.");
					case "WRONG_PASSWORD":
					return Promise.reject("The password is not valid.");
					default:
					console.log(`login error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
		}
		
		function logged(token) {
			appAPI.setToken(token);
			loggedState = true;
		}

		function setAdmin(admin){
			adminState = admin;
		}
		
		function logout() {
			console.log("logout");
			appAPI.setToken(null);
			loggedState = false;
			adminState = false;
           		 $rootScope.admin = false;
		}
		
		function verify() {
			return appAPI
			.post(makeEndpoint("verify"), {})
			.then(response => {
				return Promise.resolve(true);
			})
			.catch(error => {
				return Promise.reject(error);
			});
		}
		
		function register(email, password) {

			return appAPI
			.post(makeEndpoint("register"), {
				email: email,
				password: password
			})
			.then(response => {
				return Promise.resolve("Success!");
			})
			.catch(error => {
				
				switch (error) {
					case "USER_ALREADY_EXIST":
					return Promise.reject("That email is already used.");
					default:
					console.log(`register error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
		}
	}
})();
