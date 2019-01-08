(function() {
    "use strict";

    todoApp.factory("AdminService", AdminService);

    AdminService.$inject = ["$sce", "appAPI"];

    function AdminService($sce, appAPI) {
        const apiEndpoint = "admin/";

        function makeEndpoint(method) {
            return `${apiEndpoint}${method}`;
        }

        var service = {};

        service.Search = Search;
        service.List = List;
        service.Create = Create;
        service.Toggle_admin = Toggle_admin;
        service.Toggle_enabled = Toggle_enabled;

        return service;

        function Search(searchtext) {
            return appAPI.get(makeEndpoint('search'), {
                text : searchtext
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`admin error: ${error}`);
                return Promise.reject(error);
            });
        }

        function List() {
            return appAPI.get(makeEndpoint('list'))
                .then(response => {
                    return response;
                })
                .catch(error => {
                    console.log(`admin error: ${error}`);
                    return Promise.reject(error);
                });
        }

        function Create(mail, pwd, enabled, admin) {
            return appAPI.post(makeEndpoint('create'), {
                mail : mail,
                pwd : pwd,
                enabled : enabled,
                admin : admin
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`admin error: ${error}`);
                return Promise.reject(error);
            });
        }

        function Toggle_admin(admin, id) {
            return appAPI.post(makeEndpoint('setadmin'), {
                admin : admin,
                id : id
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`admin error: ${error}`);
                return Promise.reject(error);
            });
        }

        function Toggle_enabled(enabled, id) {
            return appAPI.post(makeEndpoint('disable'), {
                disable : enabled,
                id : id
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`admin error: ${error}`);
                return Promise.reject(error);
            });
        }
    }
})();