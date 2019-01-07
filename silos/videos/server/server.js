const express = require("express");
var bodyParser = require("body-parser");
const apiVideo = require("./api-video");
const apiPlaylist = require("./api-playlist");
var cors = require('cors')

class Server {
    constructor() {
        this.server = express();

        this.server.use(cors());

        this.server.use(bodyParser.json());
        this.server.use(
            bodyParser.urlencoded({
                extended: true
            })
        );

        this.server.use("/search", apiVideo.router);
        this.server.use("/playlists", apiPlaylist.router);
    }

    start(host, port) {
        this.server.listen(port, host, () => {
            console.log(`Listening on '${host}' on the port ${port}...`);
        });
    }
}

module.exports = new Server();
