(function() {
	"use strict";
	
	todoApp.controller("historyCtrl", historyCtrl);
	
	historyCtrl.$inject = ["$scope", "HistoryService", "$location"];
	
	function historyCtrl($scope, HistoryService, $location) {
		const vm = this;
		
		$scope.histories = null;
        HistoryService.GetHistory()
		.then(response => {
			console.log(response);
			$scope.histories = response.historiques;

		})
		.catch(error => {
			console.log(error);
		})
		.then(function() {
			$scope.$apply();
		});
		//
		$scope.redirect = function redirect(recherche){
			$location.path("/search/"+recherche);
		};
	}
	
})();
