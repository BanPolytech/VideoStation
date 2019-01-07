(function() {
    "use strict";

    todoApp.controller("playlistsCtrl", playlistsCtrl);

    playlistsCtrl.$inject = ["$scope", "$sce", "PlaylistService"];

    function playlistsCtrl($scope, $sce, PlaylistService) {
        const vm = this;

        $scope.playlists = null;
        $scope.selected_playlist = 0;

        /*$scope.videos = [
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/viqEzmUOWBM")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/txWmd7QKFe8")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/viqEzmUOWBM")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/txWmd7QKFe8")},
		{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/4CTGxKIzD7M")}];*/

        //
        var load_function = function load(idp){
        	$scope.selected_playlist = idp;
            PlaylistService.Load(idp)
                .then(response => {
                    console.log(response);
                    $scope.videos = response;
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

        //
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

    }

})();
