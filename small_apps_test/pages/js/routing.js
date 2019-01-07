var rootingApp =  angular.module('rootingApp' ,['ngRoute']);

rootingApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
        when('/page1',{
            templateUrl:"template/Page1.html",
            controller:"Page1Ctrl"
        }).
        when('/page2',{
            templateUrl:"template/Page2.html",
            controller:"Page2Ctrl"
        }).
        when('/page3',{
            templateUrl:"template/Page3.html",
            controller:"Page3Ctrl"
        }).
        otherwise({
            redirectTo:'/page1'
            
        });
    }]);

rootingApp.controller('NavCtrl',['$scope', function($scope){

}]);

rootingApp.controller('Page1Ctrl',['$scope', function($scope){
    $scope.myData = "page 1";
}]);

rootingApp.controller('Page2Ctrl',['$scope', function($scope){
    $scope.myData = "page 2";
}]);

rootingApp.controller('Page3Ctrl',['$scope', function($scope){
    $scope.myData = "page 3";
}]);