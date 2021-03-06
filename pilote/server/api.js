const express = require("express");
const axios = require("axios");


const router = express.Router();
const config = require(`${process.cwd()}/config/config`);
const Token = require('./token');

class API {
	constructor(globalBruteforce) {
		this.router = router;
		var silosConfig = config.silosConfig.silo;
		this.globalBruteforce = globalBruteforce;
		
		// global brute force, on all routes
		this.router.use(this.globalBruteforce.prevent);
		
		// route middleware to verify a token
		this.router.use(function(req, res, next) {
			var that = this;

			// check header or url parameters or post parameters for token
			var token =
			req.body.token || req.query.token || req.headers["x-access-token"];

			// decode token
			if (token) {
				// verifies secret and checks exp

				Token.verify(token)
				.then(function(tokenDecoded) {
					// if everything is good, save to request for use in other routes
					req.body.token = req.query.token = req.headers["x-access-token"] = tokenDecoded;
					next();
				})
				.catch(function(error) {
					console.log(`Token error: ${error.message}`);
					return res.json({
						success: false,
						error: "BAD_TOKEN"
					});
				});

			} else {
				// if there is no token
				// return an error
				return res.status(403).send({
					success: false,
					error: "TOKEN_NEEDED"
				});
			}
		});

		/* ----------------- */
		/* SILO HISTORIQUE   */
        /* ----------------- */

        // history
		this.router.get(`/${silosConfig.history.endpoints.history}/all`, (req, res) => {
			var that = this;

            axios
			.get(
				that.makeFullEndpoint(
					silosConfig.history,
					silosConfig.history.endpoints.history,
					"all"
				),
				{
					params: {
						token: req.body.token
					}
				}
			)
			.then(function(response) {
				res.json(response.data);
			})
			.catch(function(error) {
				res.send(that.makeError(error.message));
			});
		});

        // history
        this.router.post(`/${silosConfig.history.endpoints.history}/add`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.history,
                        silosConfig.history.endpoints.history,
                        "add"
                    ),
                    {
                        date: req.body.date,
                        query: req.body.query,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        /* ----------------- */
        /* SILO VIDEO        */
        /* ----------------- */

        // search
        this.router.post(`/${silosConfig.video.endpoints.search}/add`, (req, res) => {

            var that = this;
            var v_obj = req.body.v_obj;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.video,
                        silosConfig.video.endpoints.search,
                        "add"
                    ),
                    {
                        idPlaylist: req.body.id_p,
                        token: req.body.token,
                        video: v_obj
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // search
        this.router.post(`/${silosConfig.video.endpoints.search}/delete`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.video,
                        silosConfig.video.endpoints.search,
                        "delete"
                    ),
                    {
                        videoId: req.body.videoId,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // playlists
        this.router.get(`/${silosConfig.video.endpoints.playlists}/all`, (req, res) => {
            var that = this;

            console.log("allplaylist");

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.video,
                        silosConfig.video.endpoints.playlists,
                        "all"
                    ),
                    {
                        params: {
                            token: req.body.token
                        }
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // playlists
        this.router.get(`/${silosConfig.video.endpoints.playlists}/get`, (req, res) => {
            var that = this;

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.video,
                        silosConfig.video.endpoints.playlists,
                        "get"
                    ),
                    {
                        params: {
                        	idPlaylist: req.query.id,
                            token: req.body.token
                        }
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // playlists
        this.router.post(`/${silosConfig.video.endpoints.playlists}/new`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.video,
                        silosConfig.video.endpoints.playlists,
                        "new"
                    ),
                    {
                        name: req.body.name,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });
		
	    // playlists
        this.router.post(`/${silosConfig.video.endpoints.playlists}/add`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.video,
                        silosConfig.video.endpoints.playlists,
                        "add"
                    ),
                    {
                        v_link: req.body.v_link,
                        id_p: req.body.id_p,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // playlists
        this.router.post(`/${silosConfig.video.endpoints.playlists}/delete`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.video,
                        silosConfig.video.endpoints.playlists,
                        "delete"
                    ),
                    {
                        playlistId: req.body.playlistId,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        /* ----------------- */
        /* SILO USER         */
        /* ----------------- */

        // admin
        this.router.get(`/${silosConfig.user.endpoints.admin}/search`, (req, res) => {
            var that = this;

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.user,
                        silosConfig.user.endpoints.admin,
                        "search"
                    ),
                    {
                        params: {
                            searchtext: req.query.text,
                            token: req.body.token
                        }
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // admin
        this.router.post(`/${silosConfig.user.endpoints.admin}/create`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.user,
                        silosConfig.user.endpoints.admin,
                        "create"
                    ),
                    {
                        mail : req.body.mail,
                        pwd : req.body.pwd,
                        enabled : req.body.enabled,
                        admin : req.body.admin,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // admin
        this.router.post(`/${silosConfig.user.endpoints.admin}/setadmin`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.user,
                        silosConfig.user.endpoints.admin,
                        "setadmin"
                    ),
                    {
                        admin: req.body.admin,
                        id: req.body.id,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // admin
        this.router.post(`/${silosConfig.user.endpoints.admin}/disable`, (req, res) => {
            var that = this;

            console.log(req.body.id);

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.user,
                        silosConfig.user.endpoints.admin,
                        "disable"
                    ),
                    {
                        disable: req.body.disable,
                        id: req.body.id,
                        token: req.body.token
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

        // admin
        this.router.get(`/${silosConfig.user.endpoints.admin}/list`, (req, res) => {
            var that = this;

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.user,
                        silosConfig.user.endpoints.admin,
                        "list"
                    ),
                    {
                        params: {
                            token: req.body.token
                        }
                    }
                )
                .then(function(response) {
                    res.json(response.data);
                })
                .catch(function(error) {
                    res.send(that.makeError(error.message));
                });
        });

	}

	makeFullEndpoint(silo, name, endpoint) {
        let fullEndpoint;
        //HEROKU COND
        if (config.serverConfig.deploy === "local") {
            fullEndpoint = `http://${silo.host}:${silo.port}/${name}/${endpoint}`;
        } else if (config.serverConfig.deploy === "heroku") {
            fullEndpoint = `http://${silo.host}/${name}/${endpoint}`;
        } else {
            return this.makeError("unable to find deploy");
        }

		console.log(`Making endpoint: ${fullEndpoint}`);
		return fullEndpoint;
	}
	
	makeError(errors) {
		return {
			success: false,
			error: errors
		};
	}
	
	makeSuccess(data) {
		return {
			success: true,
			data: data
		};
	}
}

module.exports = API;
