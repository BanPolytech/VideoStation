(function() {
    "use strict";

    todoApp.factory("PlaylistService", PlaylistService);

    PlaylistService.$inject = ["$sce", "appAPI"];

    function PlaylistService($sce, appAPI) {
        const apiPlaylistEndpoint = "playlists/";
        const apiVideoEndpoint = "search/";

        function makePlaylistEndpoint(method) {
            return `${apiPlaylistEndpoint}${method}`;
        }
        function makeVideoEndpoint(method) {
            return `${apiVideoEndpoint}${method}`;
        }

        var service = {};

        service.Load = Load;
        service.New = New;
        service.LoadAll = LoadAll;
        service.Add = Add;

        return service;

        function Add(v_obj, id_p) {
            return appAPI.post(makeVideoEndpoint('add'), {
                v_obj: v_obj,
                id_p: id_p
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(`playlists error: ${error}`);
                return Promise.reject(error);
            });
        }

        function Load(id_p) {
            return appAPI.get(makePlaylistEndpoint('get'), {
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
            return appAPI.post(makePlaylistEndpoint('new'), {
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
            return appAPI.get(makePlaylistEndpoint('all'), {})
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
