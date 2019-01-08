(function() {
    "use strict";

    todoApp.controller("adminCtrl", adminCtrl);

    adminCtrl.$inject = ["$scope", "AdminService"];

    function adminCtrl($scope, AdminService) {
        const vm = this;

        $scope.error = false;
        $scope.success = false;
        $scope.users = false;

        //
        $scope.search = function search() {
            AdminService.Search($scope.searchtext)
                .then(response => {
                    console.log(response);
                    $scope.users = response.users;
                })
                .catch(error => {
                    $scope.error = error;
                })
                .then(function() {
                    $scope.$apply();
                });
        };

        $scope.list = function list() {
            AdminService.List()
                .then(response => {
                    $scope.users = response;
                })
                .catch(error => {
                    $scope.error = error;
                })
                .then(function() {
                    $scope.$apply();
                });
        };

        $scope.create = function create() {
            AdminService.Create($scope.mail_create, $scope.pwd_create, $scope.enabled_create, $scope.admin_create)
                .then(response => {
                    $scope.success = "Opération résussie.";
                })
                .catch(error => {
                    $scope.error = error;
                })
                .then(function() {
                    $scope.$apply();
                });
        };

        $scope.toggle_admin = function toggle_admin(admin, id) {
            AdminService.Toggle_admin(admin, id)
                .then(response => {
                    $scope.success = "Opération résussie.";
                    $scope.search();
                })
                .catch(error => {
                    $scope.error = error;
                })
                .then(function() {
                    $scope.$apply();
                });
        };

        $scope.toggle_enabled = function toggle_enabled(enabled, id) {
            AdminService.Toggle_enabled(enabled, id)
                .then(response => {
                    $scope.success = "Opération réussie.";
                    $scope.search();
                })
                .catch(error => {
                    $scope.error = error;
                })
                .then(function() {
                    $scope.$apply();
                });
        };
    }

})();
