(function() {
	"use strict";
	
	todoApp.config(["$routeProvider", function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'template/main.html',
			controller: 'videosHomeCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'home' }, 
			resolve: {
				access: ["Access", function (Access) { return Access.OK; }],
			}
		})
		.when('/search/:searchtext', {
			templateUrl: 'template/main.html',
			controller: 'videosHomeCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'home' }, 
			resolve: {
				access: ["Access", function (Access) { return Access.OK; }],
			}
		})
		.when('/login', {
			templateUrl: 'template/login.html',
			controller: 'loginCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'login' }, 
			resolve: {
				access: ["Access", function (Access) { return Access.OK; }],
			}
		})
		.when('/register', {
			templateUrl: 'template/register.html',
			controller: 'registerCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'register' }, 
			resolve: {
				access: ["Access", function (Access) { return Access.isAnonymous(); }],
			}
		})
		.when('/account', {
			templateUrl: 'template/account.html',
			controller: 'accountCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'account' }, 
			resolve: {
				access: ["Access", function (Access) { return Access.isAuthenticated(); }],
			}
		})
		.when('/playlists', {
			templateUrl: 'template/playlists.html',
			controller: 'playlistsCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'playlists' }, 
			resolve: {
				access: ["Access", function (Access) { return Access.isAuthenticated(); }],
			}
		})
		.when('/history', {
			templateUrl: 'template/history.html',
			controller: 'historyCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'history' }, 
			resolve: {
				access: ["Access", function (Access) { return Access.isAuthenticated(); }],
			}
		})
		.when('/admin', {
			templateUrl: 'template/admin.html',
			controller: 'adminCtrl',
			controllerAs: 'vm',
			data: { activeTab: 'admin' },
			resolve: {
				access: ["Access", function (Access) { return Access.isAdmin(); }],
			}
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);
	
})();
