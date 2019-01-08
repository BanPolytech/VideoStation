(function() {
	"use strict";
	
	todoApp.controller("videosHomeCtrl", videosHomeCtrl);
	
	videosHomeCtrl.$inject = ["$scope", "MainService", "$location", "HistoryService", "$sce", "PlaylistService"];
	
	function videosHomeCtrl($scope, MainService, $location, HistoryService, $sce, PlaylistService) {
		const vm = this;
		
		$scope.videos = null;
		$scope.playlists = null;
		$scope.show_playlist = false;
        	$scope.video_to_add = "";
		
		function loadAll(){
            PlaylistService.LoadAll()
                .then(response => {
                    console.log(response);
                    $scope.playlists = response;
                })
                .catch(error => {
                    console.log(error);
                })
                .then(function() {
                    $scope.$apply();
                });
        }

        loadAll();

        $scope.hide_playlist = function hide_playlist(){
            $scope.show_playlist = false;
		};

        $scope.actual_video = function actual_video(v){
        	$scope.video_to_add = v;
        	$scope.show_playlist = true;
		};

		$scope.add_in_playlist = function add_in_playlist(id_p){
            $scope.show_playlist = false;
            if($scope.video_to_add != ""){
                PlaylistService.Add($scope.video_to_add, id_p)
                    .then(response => {
                        $scope.playlists = response.playlists;
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .then(function() {
                        $scope.$apply();
                    });
			}
		};
				
		$scope.search = function search() {
			$location.path("/search/"+$scope.searchtext);
        };
		
		if($location.path().startsWith("/search/")){
			$scope.searchtext = $location.path().substring(8, $location.path().length);
			MainService.Search($scope.searchtext)
			.then(response => {
				console.log(response);

				var vids_vimeo = response.videos[0].data;
				vids_vimeo.forEach(function (element) {

					let id = element.uri.replace("videos", "video");
					element.link = $sce.trustAsResourceUrl("https://player.vimeo.com" + id);
				});
				$scope.vimeos = vids_vimeo;

				var vids_youtube = response.videos[1].results;
				vids_youtube.forEach(function (element) {
					element.link = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + element.id);
				});
				$scope.youtubes = vids_youtube;

				HistoryService.Add($scope.searchtext)
				.then(response => {
					console.log("enregistrement dans historique");
				})
				.catch(error => {
					console.log(error);
				})
				/*var res = [
					{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/x7HSKglzrOA")},
					{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/AX3Bsiq-13k")},
					{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/KR5CtMLuiqQ")},
					{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/viqEzmUOWBM")},
					{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/txWmd7QKFe8")},
					{"link":$sce.trustAsResourceUrl("https://www.youtube.com/embed/4CTGxKIzD7M")},
					{"link":$sce.trustAsResourceUrl("https://player.vimeo.com/video/305558448")}];*/
			})
			.catch(error => {
				console.log(error);
			})
			.then(function() {
				$scope.$apply();
			});
		}
	}
	
})();
	
