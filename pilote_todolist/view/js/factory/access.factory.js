(function() {
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
})();