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
            /*var res = [
                {"text":"ahah",
                "link1":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA"),
                "link2":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k"),
                "link3":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")},
                {"text":"hihi",
                "link1":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA"),
                "link2":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k"),
                "link3":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")},
                {"text":"hoho",
                "link1":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA"),
                "link2":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k"),
                "link3":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")},
                {"text":"huhu",
                "link1":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA"),
                "link2":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k"),
                "link3":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")},
                {"text":"hehe",
                "link1":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA"),
                "link2":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k"),
                "link3":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")}];*/
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
