(function() {
    "use strict";

    todoApp.controller("playlistsCtrl", playlistsCtrl);

    playlistsCtrl.$inject = ["$scope", "$sce", "PlaylistService", "MainService"];

    function playlistsCtrl($scope, $sce, PlaylistService, MainService) {
        const vm = this;

        $scope.playlists = null;
        $scope.selected_playlist = 0;

        //
        var load_function = function load(idp){
        	$scope.selected_playlist = idp;
            PlaylistService.Load(idp)
                .then(response => {
                    console.log(response);
                    $scope.videos = response.playlist.videos;
                    $scope.videos.forEach(function (video) {
                        video.trustlink = MainService.TrustLink(video, $sce);
                    });
                    console.log($scope.videos);
                })
                .catch(error => {
                    console.log(error);
                })
                .then(function() {
                    $scope.$apply();
                });
        };
        $scope.load = load_function;

        function loadAll(){
            PlaylistService.LoadAll()
			.then(response => {
				console.log(response);
				$scope.playlists = response.playlists;
				load_function($scope.playlists[0].id);
			})
			.catch(error => {
				console.log(error);
			})
			.then(function() {
				$scope.$apply();
			});
        }

        loadAll();

        $scope.newPlaylist = function newPlaylist(){
            PlaylistService.New($scope.newplaylist)
			.then(response => {
				console.log(response);
				$scope.playlists.push(response.playlist);
			})
			.catch(error => {
				console.log(error);
			})
			.then(function() {
				$scope.$apply();
			});
        };

        $scope.delete_from_playlist = function delete_from_playlist(id_v){
            if ($scope.selected_playlist != 0) {
               MainService.Delete(id_v)
                    .then(response => {
                        console.log(response);
                        load_function($scope.selected_playlist);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .then(function () {
                        $scope.$apply();
                    });
            }
        };

        $scope.delete_playlist = function delete_playlist(idp){
            PlaylistService.Delete(idp)
                .then(response => {
                    console.log(response);
                    loadAll();
                })
                .catch(error => {
                    console.log(error);
                })
                .then(function () {
                    $scope.$apply();
                });
        };

    }

})();
