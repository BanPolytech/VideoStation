$(document).ready(function(){

	var button = document.getElementById("submit");

	button.addEventListener("click", function(){

		var username = document.getElementById("name").value;
    	var password = document.getElementById("paw").value;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'http://localhost:8080/login', true);
		xhr.responseType = 'json';

		xhr.setRequestHeader("Content-type", "application/json");
		xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

		xhr.onload = function(e) {
		  if (this.status == 200) {
		    console.log('response', this.response); // JSON response
		  	
		    var responseDiv = document.getElementById("response");

		    responseDiv.innerHTML = this.response.success ? "Succeed" : "Failure";

		  }
		};
 
		xhr.send(JSON.stringify({ 
			"email": username,
			"password": password
		}));

	});

});