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

        // playlists
        this.router.get(`/${silosConfig.playlists.endpoints.playlists}/all`, (req, res) => {
            var that = this;

            console.log("allplaylist");

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.playlists,
                        silosConfig.playlists.endpoints.playlists,
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
        this.router.get(`/${silosConfig.playlists.endpoints.playlists}/load`, (req, res) => {
            var that = this;

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.playlists,
                        silosConfig.playlists.endpoints.playlists,
                        "load"
                    ),
                    {
                        params: {
                        	id: req.query.id,
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
        this.router.post(`/${silosConfig.playlists.endpoints.playlists}/new`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.playlists,
                        silosConfig.playlists.endpoints.playlists,
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
        this.router.post(`/${silosConfig.playlists.endpoints.playlists}/add`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.playlists,
                        silosConfig.playlists.endpoints.playlists,
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

        // admin
        this.router.get(`/${silosConfig.admin.endpoints.admin}/search`, (req, res) => {
            var that = this;

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.admin,
                        silosConfig.admin.endpoints.admin,
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
        this.router.post(`/${silosConfig.admin.endpoints.admin}/create`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.admin,
                        silosConfig.admin.endpoints.admin,
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
        this.router.post(`/${silosConfig.admin.endpoints.admin}/setadmin`, (req, res) => {
            var that = this;

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.admin,
                        silosConfig.admin.endpoints.admin,
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
        this.router.post(`/${silosConfig.admin.endpoints.admin}/disable`, (req, res) => {
            var that = this;

            console.log(req.body.id);

            axios
                .post(
                    that.makeFullEndpoint(
                        silosConfig.admin,
                        silosConfig.admin.endpoints.admin,
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

        //admin
        this.router.post(`/${silosConfig.admin.endpoints.admin}/list`, (req, res) => {
            var that = this;

            axios
                .get(
                    that.makeFullEndpoint(
                        silosConfig.admin,
                        silosConfig.admin.endpoints.admin,
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
		
		/*this.router.get(`/${silosConfig.task.endpoints.task}/all`, (req, res) => {
			var that = this;
			
			axios
			.get(
				that.makeFullEndpoint(
					silosConfig.task,
					silosConfig.task.endpoints.task,
					"all"
				),
				{
					params: {
						idList: req.query.idList,
						isDone: req.query.isDone,
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
		
		
		this.router.put(
			`/${silosConfig.task.endpoints.task}/update`,
			(req, res) => {
				var that = this;
				
				axios
				.post(
					that.makeFullEndpoint(
						silosConfig.task,
						silosConfig.task.endpoints.task,
						"update"
					),
					{
						token: req.body.token,
						task: req.body.task
					}
				)
				.then(function(response) {
					res.json(response.data);
				})
				.catch(function(error) {
					res.send(that.makeError(error.message));
				});
			}
		);
		
		this.router.delete(
			`/${silosConfig.task.endpoints.task}/delete`,
			(req, res) => {
				var that = this;
				
				axios
				.post(
					that.makeFullEndpoint(
						silosConfig.task,
						silosConfig.task.endpoints.task,
						"delete"
					),
					{
						token: req.body.token,
						task: req.body.task
					}
				)
				.then(function(response) {
					res.json(response.data);
				})
				.catch(function(error) {
					res.send(that.makeError(error.message));
				});
			}
		);
		
		// list
		this.router.post(`/${silosConfig.task.endpoints.list}/add`, (req, res) => {
			var that = this;
			
			axios
			.post(
				that.makeFullEndpoint(
					silosConfig.task,
					silosConfig.task.endpoints.list,
					"add"
				),
				{
					list: req.body.list,
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
		
		this.router.get(`/${silosConfig.task.endpoints.list}/all`, (req, res) => {
			var that = this;
			
			axios
			.get(
				that.makeFullEndpoint(
					silosConfig.task,
					silosConfig.task.endpoints.list,
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

		this.router.get(`/${silosConfig.task.endpoints.list}/get`, (req, res) => {
			var that = this;
			
			axios
			.get(
				that.makeFullEndpoint(
					silosConfig.task,
					silosConfig.task.endpoints.list,
					"get"
				),
				{
					params: {
						idList: req.query.idList,
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
		
		this.router.put(
			`/${silosConfig.task.endpoints.list}/update`,
			(req, res) => {
				var that = this;
				
				axios
				.post(
					that.makeFullEndpoint(
						silosConfig.task,
						silosConfig.task.endpoints.list,
						"update"
					),
					{
						token: req.body.token,
						list: req.body.list
					}
				)
				.then(function(response) {
					res.json(response.data);
				})
				.catch(function(error) {
					res.send(that.makeError(error.message));
				});
			}
		);
		
		this.router.delete(
			`/${silosConfig.task.endpoints.list}/delete`,
			(req, res) => {
				var that = this;
				
				axios
				.post(
					that.makeFullEndpoint(
						silosConfig.task,
						silosConfig.task.endpoints.list,
						"delete"
					),
					{
						token: req.body.token,
						list: req.body.list
					}
				)
				.then(function(response) {
					res.json(response.data);
				})
				.catch(function(error) {
					res.send(that.makeError(error.message));
				});
			}
		);*/
	}
	
	makeFullEndpoint(silo, name, endpoint) {
		const fullEndpoint = `http://${silo.host}:${silo.port}/${name}/${endpoint}`;
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
