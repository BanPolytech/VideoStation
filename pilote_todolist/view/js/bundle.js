const todoApp = angular.module("todoApp", ["ngRoute", "ngAnimate"]);(function() {
	"use strict";
	todoApp.factory("Access", ["$q", "UserFactory", function($q, UserFactory) {
		
		var Access = { OK: 200, UNAUTHORIZED: 401, FORBIDDEN: 403,
			isAuthenticated: function() {
				
				if (UserFactory.isLogged) {
					return Access.OK;
				} else {
					return Promise.reject(Access.UNAUTHORIZED);
				}
				
			},
			isAnonymous: function() {
				
				if (UserFactory.isLogged) {
					return Promise.reject(Access.FORBIDDEN);
				} else {
					return Access.OK;
				}
			} 
		};
		
		return Access;
		
	}]);
})();(function() {
	"use strict";
	
	todoApp.factory("appAPI", appAPI);
	
	function appAPI() {
		const apiURL = "/api/";
		
		function getToken() {
			return localStorage.getItem("token");
		}
		
		function setToken(newValue) {
			return localStorage.setItem("token", newValue);
		}
		function send(path, params = {}, type = "POST") {
			
			let url = `${apiURL}${path}`;
			
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				
				xhr.open(type, url, true);
				xhr.responseType = "json";
				
				xhr.setRequestHeader("Content-type", "application/json");
				xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
				// todo: improve by using only one method get and set (user ?)
				xhr.setRequestHeader("x-access-token", getToken());
				
				xhr.onload = () => {
					try {
						// try to see if success
						if (xhr.response.success) {
							resolve(xhr.response.data);
							// it's an error
						} else {
							// todo:
							// check if error is related to token
							// BAD_TOKEN or TOKEN_NEEDED
							reject(xhr.response.error);
						}
					} catch (e) {
						// no proper format, don't know if success or error
						// so we reject
						reject(xhr.response);
					}
				};
				
				xhr.onerror = () => {
					// todo error
					console.log(xhr.error);
					reject();
					// if BAD_TOKEN or TOKEN_NEEDED
					// logout and login
				};
				
				xhr.send(JSON.stringify(params));
			});
		}
		
		function get(path, params = {}) {
			
			function formatParams(params) {
				return "?" + Object.keys(params)
				.map(function(key) {
					return key + "=" + encodeURIComponent(params[key]);
				})
				.join("&");
			}
			
			return send(path + formatParams(params), null, "GET")
		}
		
		function post(path, params = {}) {
			return send(path, params, "POST")
		}
		
		function remove(path, params = {}) {
			return send(path, params, "DELETE")
		}
		
		function put(path, params = {}) {
			return send(path, params, "PUT");
		}
		
		const services = { post, remove, put, get, getToken, setToken };
		
		return services;
		
	}
})();
(function() {
	"use strict";
	
	todoApp.factory("UserFactory", userFactory);
	
	userFactory.$inject = ["appAPI"];
	
	function userFactory(appAPI) {
		
		const apiEndpoint = "user/";
		var loggedState = false;
		
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
		
		function logout() {
			appAPI.setToken(null);
			loggedState = false;
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
(function() {
	"use strict";
	
	todoApp.factory("ListFactory", listFactory);
	
	listFactory.$inject = ["appAPI"];
	
	function listFactory(appAPI) {
		const apiEndpoint = "list/";
		
		function makeEndpoint(method) {
			return `${apiEndpoint}${method}`;
		}
		
		const services = { all, get, add, remove };
		
		return services;
		function all() {
			return appAPI.get(makeEndpoint("all"), {});
		}
		
		function get(id) {
			return appAPI
			.get(makeEndpoint("get"), { idList: id })
			.catch(error => {
				switch (error) {
					case "INVALID_LIST_ID_FORMAT":
						return Promise.reject("Invalid format of the list.");
					case "LIST_NOT_EXIST":
						return Promise.reject("This list does not exist.");
					default:
						console.log(`get list error: ${error}`);
						return Promise.reject("An unknow error occured.");
				}
			});
		}
		
		function add(name) {
			return appAPI
			.post(
				makeEndpoint("add"), 
				{ 
					list: {
						name: name 
					}
				}
			)
			.catch(error => {
				switch (error) {
					// todo handle error
					default:
					console.log(`add list error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
		}
		
		function remove(id) {
			return appAPI
			.remove(makeEndpoint("delete"), { list: { id: id } })
			.catch(error => {
				switch (error) {
					// todo handle error
					default:
					console.log(`delete list error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
		}
		
	}
})();
(function() {
	"use strict";
	
	todoApp.factory("TaskFactory", taskFactory);
	
	taskFactory.$inject = ["appAPI"];
	
	function taskFactory(appAPI) {
		const apiEndpoint = "task/";
		
		function makeEndpoint(method) {
			return `${apiEndpoint}${method}`;
		}
		
		const services = { all, remove, add, update };
		
		return services;
		function all(id) {
			return appAPI
			.get(makeEndpoint("all"), { task: { idList: id } })
			.catch(error => {
				switch (error) {
					case "INVALID_LIST_ID_FORMAT":
					return Promise.reject("Invalid format of the list.");
					case "LIST_NOT_EXIST":
					return Promise.reject("This list does not exist.");
					default:
					console.log(`register error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
		}
		
		function remove(id) {
			return appAPI
			.remove(makeEndpoint("delete"), { task: { id: id } })
			.catch(error => {
				switch (error) {
					// todo handle error
					default:
					console.log(`delete list error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
			
		}
		
		function add(idList, name) {
			return appAPI
			.post(makeEndpoint("add"), {
				task: { idList: idList, name: name }
			})
			.catch(error => {
				switch (error) {
					case 'LIST_NOT_EXIST':
					return Promise.reject("The list does not exist.");
					// todo handle error
					default:
					console.log(`add list error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
		}
		
		function update(idTask, name = undefined, isDone = undefined, idList = undefined) {
			var task = {};
			task.id = idTask;
			
			if (typeof(name) !== "undefined") {
				task.name = name;
			}
			if (typeof(isDone) !== "undefined") {
				task.isDone = isDone;
			}
			if (typeof(idList) !== "undefined") {
				task.idList = idList;
			}
			return appAPI
			.put(makeEndpoint("update"), { task: task })
			.catch(error => {
				switch (error) {
					// todo handle error
					default:
					console.log(`update list error: ${error}`);
					return Promise.reject("An unknow error occured.");
				}
			});
		}
		
	}
})();
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
	
})();(function() {
	"use strict";
	
	todoApp.controller("homeController", homeController);
	
	homeController.$inject = ["$scope", "$location", "UserFactory", "ListFactory"];
	
	function homeController($scope, $location, UserFactory, ListFactory) {
		const vm = this;
		
		vm.addList = function() {
			
			vm.loadingClass = "is-loading";
			
			ListFactory.add(vm.listName)
			.then(response => {
				// add the new list created to the arrays of list
				vm.lists.push(response.list);
				// reset input
				vm.listName = null;
			})
			.catch(error => {
				// todo handle error
				console.log("error", error);
			})
			.then(function() {
				vm.loadingClass = "";
				$scope.$apply();
			});
		};
		
		vm.removeList = function(listID) {
			
			ListFactory.remove(listID)
			.then(response => {
				// remove the new list created to the arrays of list
				vm.lists = vm.lists.filter(function(list) {
					return list._id !== listID;
				});
			})
			.catch(error => {
				// todo handle error
				console.log("error", error);
			})
			.then(function() {
				$scope.$apply();
			});
		};
		
		vm.seeList = function(listID) {
			$location.path(`/list/${listID}`);
		};
		
		ListFactory.all()
		.then(response => {
			vm.lists = response.lists;
		})
		.catch(error => {
			// todo handle error
			console.log("error", error);
		})
		.then(function() {
			$scope.$apply();
		});
		
	}
	
})();(function() {
	"use strict";
	
	todoApp.controller("registerController", registerController);
	
	registerController.$inject = ["$scope", "$location", "UserFactory"];
	
	function registerController($scope, $location, UserFactory) {
		const vm = this;
		
		vm.registerUser = function() {

			vm.loadingClass = "is-loading";
			
			UserFactory.register(vm.email, vm.password)
			.then(response => {
				$location.path("/login");
			})
			.catch(error => {
				vm.errorRegister = error;
			})
			.then(function() {
				vm.loadingClass = "";
				$scope.$apply();
			});
		};
		
		vm.goLogin = function() {
			$location.path("/login");
		};
		
	}
})();
(function() {
	"use strict";
	
	todoApp.controller("listController", listController);
	
	listController.$inject = ["$scope", "$location", "$routeParams", "TaskFactory", "ListFactory"];
	
	function listController($scope, $location, $routeParams, TaskFactory, ListFactory) {
		const vm = this;
		vm.taskToAdd = {};
		vm.list = {};
		
		vm.removeTask = function(taskID) {
			TaskFactory.remove(taskID)
			.then(response => {
				// remove the new list created to the arrays of list
				vm.list.tasks = vm.list.tasks.filter(function(task) {
					return task._id !== taskID;
				});
			})
			.catch(error => {
				// todo handle error
				console.log("error", error);
			})
			.then(function() {
				$scope.$apply();
			});
		};
		
		vm.addTask = function() {
			$scope.addLoadingClass = "is-loading";
			
			TaskFactory.add($routeParams.id, vm.taskToAdd.name)
			.then(response => {
				// add the new task created to the arrays of tasks
				vm.list.tasks.push(response.task);
				// reset input
				vm.taskToAdd.name = null;
			})
			.catch(error => {
				vm.errorList = error;
			})
			.then(function() {
				vm.addLoadingClass = "";
				$scope.$apply();
			});
		};
		
		vm.updateStatus = function(idTask, isDone) {
			TaskFactory.update(idTask, undefined, isDone, undefined)
			.then(response => {
				// update the task
				var index = vm.list.tasks.findIndex(task => task._id == idTask);
				vm.list.tasks[index].isDone = isDone;
			})
			.catch(error => {
				vm.errorList = error;
			})
			.then(function() {
				$scope.$apply();
			});
		};
		
		ListFactory.get($routeParams.id)
		.then(response => {
			vm.list.name = response.list.name;
			vm.list.tasks = response.list.tasks;
		})
		.catch(error => {
			vm.errorList = error;
		})
		.then(function() {
			$scope.$apply();
		});
	}
})();
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
(function() {
	"use strict";
	
	todoApp.run([
		"$rootScope",
		"Access",
		"$location",
		"UserFactory",
		function($rootScope, Access, $location, UserFactory) {
			$rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
				console.log("routeChangeError");
				switch (rejection) {
					case Access.UNAUTHORIZED:
					$location.path("/login");
					break;
					
					case Access.FORBIDDEN:
					$location.path("/home");
					break;
					
					default:
					console.log(`$stateChangeError event catched: ${rejection}`);
					console.log(`event: ${event}`);
					break;
				}
			});
			
			$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        		$rootScope.title = current.$$route.title;
    		});
		}
		
	]);
})();