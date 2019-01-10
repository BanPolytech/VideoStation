(function () {
    'use strict';
 
    todoApp.factory("MainService", MainService);
	
	MainService.$inject = ["appAPI"];
 
    function MainService(appAPI) {
        const apiEndpoint = "search/";

        function makeEndpoint(method) {
            return `${apiEndpoint}${method}`;
        }

        var service = {};
 
        service.Search = Search;
        service.TrustLink = TrustLink;
 
        return service;
 
        function Search(searchtext) {
            return appAPI.get(makeEndpoint('search'), {
                text: searchtext
            })
			.then(response => {
				return response;
			})
			.catch(error => {
                console.log(`search error: ${error}`);
				return Promise.reject(error);
			});
        }

        function TrustLink(video_obj, $sce) {

            var trustlink;

            switch (video_obj.brand) {
                case "Vimeo":
                    trustlink = $sce.trustAsResourceUrl("https://player.vimeo.com/video/" + video_obj.videoId);
                    break;

                case "Youtube":
                    trustlink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + video_obj.videoId);
                    break;
            }

            return trustlink;
        }
    }
})();