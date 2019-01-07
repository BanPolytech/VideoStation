(function () {
    'use strict';
 
    todoApp.factory("MainService", MainService);
	
	MainService.$inject = ["appAPI"];
 
    function MainService(appAPI) {
        const apiEndpoint = "search/";

        function makeEndpoint(method) {
            return `${apiEndpoint}${method}`;
        }

        var service = {};
 
        service.Search = Search;
 
        return service;
 
        function Search(searchtext) {
            return appAPI.get(makeEndpoint('search'), {
                text: searchtext
            })
			.then(response => {
				return response;
			})
			.catch(error => {
                console.log(`search error: ${error}`);
				return Promise.reject(error);
			});
        }
		
    }
})();