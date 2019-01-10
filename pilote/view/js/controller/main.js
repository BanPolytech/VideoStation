(function() {
	"use strict";
	
	todoApp.controller("videosHomeCtrl", videosHomeCtrl);
	
	videosHomeCtrl.$inject = ["$scope", "MainService", "$location", "HistoryService", "$sce", "PlaylistService", "UserFactory"];
	
	function videosHomeCtrl($scope, MainService, $location, HistoryService, $sce, PlaylistService, UserFactory) {
		const vm = this;
		
		$scope.videos = null;
		$scope.playlists = null;
		$scope.show_playlist = false;
		$scope.video_to_add = "";
		
	function loadAll(){
		if(UserFactory.isLogged){
		    PlaylistService.LoadAll()
			.then(response => {
			    console.log(response);
			    $scope.playlists = response.playlists;
			})
			.catch(error => {
			    console.log(error);
			})
			.then(function() {
			    $scope.$apply();
			});
		}
        }

        loadAll();

        $scope.hide_playlist = function hide_playlist(){
            $scope.show_playlist = false;
		};

        $scope.actual_video = function actual_video(v){
        	$scope.video_to_add = v;
        	console.log(v);
        	$scope.show_playlist = true;
		};

		$scope.add_in_playlist = function add_in_playlist(id_p){
            $scope.hide_playlist();
            if($scope.video_to_add !== null){
                PlaylistService.Add($scope.video_to_add, id_p)
                    .then(response => {
                        // $scope.playlists = response.playlists;
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

				//FORMAT VIMEO VIDEO OBJ
				var vids_vimeo = response.videos[0].data;
				vids_vimeo.forEach(function (element) {

					element.title = element.name;
					element.channelId = element.user.uri;
					element.channelTitle = element.user.name;
					element.videoId = element.uri.replace("/videos/", "");
					element.publishedAt = element.release_time;
					element.thumbnails = element.pictures;
					element.trustlink = MainService.TrustLink(element, $sce);
				});
				$scope.vimeos = vids_vimeo;

				//FORMAT YOUTUBE VIDEO OBJ
				var vids_youtube = response.videos[1].results;
				vids_youtube.forEach(function (element) {
					element.videoId = element.id;
					element.trustlink = MainService.TrustLink(element, $sce);
				});
				$scope.youtubes = vids_youtube;

				if(UserFactory.isLogged){
					HistoryService.Add($scope.searchtext)
					.then(response => {
						console.log("enregistrement dans historique");
					})
					.catch(error => {
						console.log(error);
					})
				}
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
	
