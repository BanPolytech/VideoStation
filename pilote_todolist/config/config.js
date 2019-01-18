const fs = require("fs");
const path = require("path");
const yml = require("js-yaml");

const serverConfigPath = "server-config.yml";

const silosConfigPath = "silos-config.yml";
const silosConfigHerokuPath = "silos-config-heroku.yml";

let serverConfig;
let silosConfig;

let isOnline = (process.env.PORT !== undefined);

try {
	serverConfig = yml.safeLoad(fs.readFileSync(path.join(__dirname, serverConfigPath), "utf8"));
	if (isOnline) {
		console.log("server on heroku");
		serverConfig.deploy = "heroku";
		serverConfig.server.port = process.env.PORT;
	} else {
		console.log("server on local");
		serverConfig.deploy = "local";
	}
	console.log("Server config file loaded.");
} catch (e) {
	console.log("Could not load the server config file");
	process.exit(1);
}

try {
	if (isOnline) {
		silosConfig = yml.safeLoad(fs.readFileSync(path.join(__dirname, silosConfigHerokuPath), "utf8"));
	} else {
		silosConfig = yml.safeLoad(fs.readFileSync(path.join(__dirname, silosConfigPath), "utf8"));
	}
	console.log("Silos config file loaded.");
} catch (e) {
	console.log("Could not load the silos config file");
	process.exit(1);
}

module.exports.serverConfig = serverConfig;
module.exports.silosConfig = silosConfig;
