const express = require("express");
var bodyParser = require("body-parser");
const api = require("./api-user");

class Server {
  constructor() {
    this.server = express();
	
	this.server.use(bodyParser.json());
  	this.server.use(
		bodyParser.urlencoded({
			extended: true
		})
	);

    this.server.use("/user", api.router);
  }

  start(host, port) {
    this.server.listen(port, host, () => {
    	console.log(`Listening on '${host}' on the port ${port}...`);
    });
  }
}

module.exports = new Server();
