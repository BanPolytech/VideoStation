const express = require("express");
var bodyParser = require("body-parser");
const apiHistorique = require("./api.historique");

const config = require(`${process.cwd()}/config/config`);

class Server {
  constructor() {
    this.server = express();
	
	this.server.use(bodyParser.json());
  	this.server.use(
		bodyParser.urlencoded({
			extended: true
		})
	);

	this.server.use("/history", apiHistorique.router);
  }

	start(host, port) {
		//HEROKU COND
		if (config.serverConfig.deploy === "heroku") {
			this.server.listen(port, () => {
				console.log(`Listening on '${host}' on the port ${port}...`);
			})
		} else {
			this.server.listen(port, host, () => {
				console.log(`Listening on '${host}' on the port ${port}...`);
			});
		}

	}
}

module.exports = new Server();
