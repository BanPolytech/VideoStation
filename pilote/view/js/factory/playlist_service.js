(function() {
    "use strict";

    todoApp.factory("PlaylistService", PlaylistService);

    PlaylistService.$inject = ["$sce", "appAPI"];

    function PlaylistService($sce, appAPI) {
        const apiEndpoint = "playlists/";

        function makeEndpoint(method) {
            return `${apiEndpoint}${method}`;
        }

        var service = {};

        service.Load = Load;
        service.New = New;
        service.LoadAll = LoadAll;

        return service;

        function Load(id_p) {
            return appAPI.get(makeEndpoint('load'), {
                id: id_p
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`playlists error: ${error}`);
                return Promise.reject(error);
            });
        }

        function New(p_name) {
            return appAPI.post(makeEndpoint('add'), {
                name: p_name
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`playlists error2: ${error}`);
                return Promise.reject(error);
            });
        }

        function LoadAll() {
            return appAPI.get(makeEndpoint('all'), {})
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`playlists error3: ${error}`);
                return Promise.reject(error);
            });
        }
    }
})();