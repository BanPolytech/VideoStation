const express = require("express");
var bodyParser = require("body-parser");
const apiUser = require("./api-user");
const apiAdmin = require("./api-admin");

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

    this.server.use("/user", apiUser.router);
    this.server.use("/admin", apiAdmin.router);
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
