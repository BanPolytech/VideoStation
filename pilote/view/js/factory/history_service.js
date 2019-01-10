(function() {
	"use strict";
	
	todoApp.factory("HistoryService", HistoryService);
	
	HistoryService.$inject = ["$sce", "appAPI"];
	
	function HistoryService($sce, appAPI) {
        const apiEndpoint = "history/";

        function makeEndpoint(method) {
            return `${apiEndpoint}${method}`;
        }

        var service = {};

        service.GetHistory = GetHistory;
        service.Add = Add;
 
        return service;

        function GetHistory() {
            return appAPI.get(makeEndpoint('all'), {})
                .then(response => {
                    return response;
                })
                .catch(error => {
                    console.log(`history error: ${error}`);
                    return Promise.reject(error);
                });
        }

        function Add(query) {
            var date = Date.now();
            return appAPI.post(makeEndpoint('add'), {
                date: date,
                query: query
            })
                .then(response => {
                    return response;
                })
                .catch(error => {
                    console.log(`history error: ${error}`);
                    return Promise.reject(error);
                });
        }
    }
})();