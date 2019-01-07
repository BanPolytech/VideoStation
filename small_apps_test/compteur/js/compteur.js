var counterApp = angular.module('counterApp', []);

counterApp.controller('CounterSavedCtrl', ['$scope', function($scope) {

	$scope.load = function () {
		$scope.counter = localStorage.getItem("counter");
	};

	$scope.increment = function () {
		$scope.counter++;
		localStorage.setItem("counter", $scope.counter);
	};

	$scope.load();

}]);