const express = require("express");
const bcrypt = require("bcrypt");
const check = require("check-types");

const config = require(`${process.cwd()}/config/config`);
const Database = require("./db");
const Admin = require("./models/admin");
const User = require("./models/user");

const router = express.Router();

class ApiAdmin {
	constructor() {
		router.post("/create", (req, res) => {

			// get params
			var email = req.body.mail;
			var password = req.body.pwd;
			var enabled = req.body.enabled;
			var adminStatus = req.body.admin;

			// check params
			if (!email || !password) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// email check
			if (!check.string(email) ||
				!check.nonEmptyString(email) ||
				!check.match(email, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
			) {
				res.send(this.makeError("NOT_VALID_MAIL"));
				return;
			}

			// password check
			if (!check.string(password) ||
				!check.nonEmptyString(password) ||
				!check.match(password, /^\s*(\S\s*){4,20}$/)
			) {
				res.send(this.makeError("NOT_VALID_PASSWORD"));
				return;
			}

			var database = new Database();
			var user;
			var admin;

			database
				.connectDB()
				.then(db => {
					return db.collection("users");
				})
				.then(usersCollection => {
					user = new User(usersCollection);
					admin = new Admin(usersCollection);
					return user.findUserByEmail(email);
				})
				.then(userFound => {
					if (userFound) {
						return Promise.reject(new Error("USER_ALREADY_EXIST"));
					}
					return bcrypt.hash(password, config.serverConfig.crypto.saltRound);
				})
				.then(passwordHashed => {
					return admin.createUser(email, passwordHashed, enabled, adminStatus);
				})
				.then(newUser => {
					console.log("CREATE USER : " + newUser.toString());
					res.send(this.makeSuccess(`User created ${email}`));
				})
				.catch(err => {
					console.log(err);
					res.send(this.makeError(err.message));
				})
				.then(function() {
					database.closeDB();
				});

		});
		
		router.post("/disable", (req, res) => {

			// get params
			var disable = req.body.disable;
			var userID = req.body.id;

			var database = new Database();
			var admin;

			database
				.connectDB()
				.then(db => {
					return db.collection("users");
				})
				.then(usersCollection => {
					admin = new Admin(usersCollection);
					return admin.toggleSuspend(userID, disable);
				})
				.then(userSuspendChange => {
					console.log("NEW SUSPEND VALUE OF USER : " + userSuspendChange.toString());
					res.send(this.makeSuccess(`User suspend changes`));
				})
				.catch(err => {
					console.log(err);
					res.send(this.makeError(err.message));
				})
				.then(function() {
					database.closeDB();
				});

		});

		router.post("/setadmin", (req, res) => {

			// get params
			var toggle = req.body.admin;
			var userID = req.body.id;

			var database = new Database();
			var admin;

			database
				.connectDB()
				.then(db => {
					return db.collection("users");
				})
				.then(usersCollection => {
					admin = new Admin(usersCollection);
					return admin.toggleAdmin(userID, toggle);
				})
				.then(userAdminChange => {
					console.log("NEW ADMIN VALUE OF USER : " + userAdminChange.toString());
					res.send(this.makeSuccess(`User admin changes`));
				})
				.catch(err => {
					console.log(err);
					res.send(this.makeError(err.message));
				})
				.then(function() {
					database.closeDB();
				});
		});

		router.get("/search", (req, res) => {

			//GET PARAMS
			var query = req.query.searchtext;
			var userID = JSON.parse(req.query.token).id;

			// check params
			if (!query || !userID) {
				res.send(this.makeError("MISSING_PARAMS"));
			}

			var database = new Database();
			var users;

			database
				.connectDB()
				.then(db => {
					return db.collection("users");
				})
				.then(usersCollection => {
					users = new Admin(usersCollection);
					return users.searchUser(query)
				})
				.then(usersFound => {
					console.log("FOUND " + usersFound.length + " results : \n" + usersFound.toString());
					res.send(this.makeSuccess({users: usersFound}))
				})
				.catch(err => {
					console.log(err);
					res.send(this.makeError(err.message));
				})
				.then(function() {
					database.closeDB();
				});

		});

		router.get("/list", (req, res) => {
			var that = this;

			var database = new Database();
			var users;

			database
				.connectDB()
				.then(db => {
					return db.collection("users");
				})
				.then(usersCollection => {
					users = new Admin(usersCollection);
					return users.getAllUsers();
				})
				.then(allUsers => {
					console.log("GET ALL USERS");
					return res.send(that.makeSuccess({ users: allUsers }));
				})
				.catch(err => {
					console.log(err);
					res.send(this.makeError(err.message));
				})
				.then(function() {
					database.closeDB();
				});
		});

	}
	
	makeError(errors) {
		return { success: false, error: errors };
	}
	
	makeSuccess(data) {
		return { success: true, data: data };
	}
	
}

module.exports.api = new ApiAdmin();
module.exports.router = router;
