const express = require("express");
const check = require("check-types");

const Database = require("./db");
const Historique = require("./models/historique");

const router = express.Router();

class ApiHistorique {
	constructor() {
		router.get("/all", (req, res) => {
			var that = this;
			
			//get param
			var userID = JSON.parse(req.query.token).id;
			
			//check param
			if (!userID) {
				res.send(this.makeError("ALL MISSING_PARAMS"));
				return;
			}
			
			var database = new Database();
			var historique;
			
			database
			.connectDB()
			.then(db => {
				return db.collection("historiques");
			})
			.then(historiquesCollection => {
				historique = new Historique(historiquesCollection);
				return historique.getHistoriques(userID);
			})
			.then(allHistoriques => {
				console.log("GET HISTORIQUES");
				return res.send(that.makeSuccess({ historiques: allHistoriques }));
			})
			.catch(err => {
				console.log(err);
				res.send(this.makeError(err.message));
				return;
			})
			.then(function() {
				database.closeDB();
			});
			
		});

		router.get("/get", (req, res) => {
			var that = this;
			
			//get param
			var idHistorique, userID;
			
			try {
				idHistorique = req.query.idHistorique,
				userID = JSON.parse(req.query.token).id;
				
				if (!idHistorique || !userID) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// idHistorique check
			if (!check.string(idHistorique) || 
			!check.nonEmptyString(idHistorique) 
			) {
				res.send(this.makeError("NOT_VALID_LIST_ID"));
        		return;
			}
			
			var database = new Database();
			var task, historique;
			
			database
			.connectDB()
			.then(db => {
				var tasks = db.collection("tasks");
				var historiques = db.collection("historiques");
				return [tasks, historiques];
			})
			.then(([tasksCollection, historiquesCollection]) => {
				task = new Task(tasksCollection);
				historique = new Historique(historiquesCollection);
				return historique.checkHistorique(idHistorique, userID);
			})
			.then(foundHistorique => {
				if (!foundHistorique) {
					return Promise.reject(new Error("LIST_NOT_EXIST"));
				}
				return task.getTasks(idHistorique, userID, null).then(allTasks => {
					foundHistorique.tasks = allTasks;
					return res.send(that.makeSuccess({ historique: foundHistorique }));
				});
			})
			.catch(err => {
				console.log(err);
				res.send(this.makeError(err.message));
				return;
			})
			.then(function() {
				database.closeDB();
			});
		});
		
		router.post("/add", (req, res) => {
			var that = this;
			
			//get param
			var query, userID, date;
			
			try {
				userID = req.body.token.id;
				query = req.body.query;
				date = req.body.date;

				console.log(query, userID, date);
				
				if (!query || !userID || !date) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// query check
			if (!check.string(query) || 
			!check.nonEmptyString(query) || 
			!check.match(query, /^\s*(\S\s*){1,25}$/)
			) {
				res.send(this.makeError("NOT_VALID_LIST_NAME"));
        		return;
			}
			
			var database = new Database();
			var historique;
			
			database
			.connectDB()
			.then(db => {
				return db.collection("historiques");
			})
			.then(historiquesCollection => {
				historique = new Historique(historiquesCollection);
				return historique.createHistorique(userID, query, date);
			})
			.then(newHistorique => {
				console.log("CREATED HISTORY");
				return res.send(that.makeSuccess({ historique: newHistorique.ops[0] }));
			})
			.catch(err => {
				console.log(err);
				res.send(this.makeError(err.message));
				return;
			})
			.then(function() {
				database.closeDB();
			});
			
		});
		
		router.post("/update", (req, res) => {
			var that = this;
			
			//get param
			var historiqueID, query, userID;
			
			try {
				historiqueID = req.body.historique.id;
				query = req.body.historique.query;
				userID = req.body.token.id;
				
				if (!historiqueID || !userID) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// query check
			if (check.string(query) &&
			(!check.nonEmptyString(query) ||
			!check.match(query, /^\s*(\S\s*){1,25}$/)
			)) {
				res.send(this.makeError("NOT_VALID_LIST_NAME"));
        		return;
			}
			
			var database = new Database();
			var task, historique;
			
			database
			.connectDB()
			.then(db => {
				return db.collection("historiques");
			})
			.then(historiquesCollection => {
				historique = new Historique(historiquesCollection);
				
				var values = {};
				
				// add data to update
				if (query) {
					values.query = query;
				}
				
				// we will also check if task € user before update
				var otherFilter = { userID: userID };
				
				return historique.updateHistorique(historiqueID, otherFilter, values);
			})
			.then(updatedHistorique => {
				if (!updatedHistorique.value) {
					return Promise.reject(new Error("LIST_NOT_EXIST"));
				}
				
				console.log("UPDATED LIST");
				return res.send(that.makeSuccess({ historique: updatedHistorique.value }));
			})
			.catch(err => {
				console.log(err);
				res.send(this.makeError(err.message));
				return;
			})
			.then(function() {
				database.closeDB();
			});
			
		});
		
		router.post("/delete", (req, res) => {
			var that = this;
			
			//get param
			// var historiqueID = req.body.historique.id;
			// var userID = req.body.token.id;
			var historiqueID = req.body.historique;
			var userID = req.body.id;
			
			//check param
			if (!historiqueID || !userID) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}
			
			var database = new Database();
			var historique;
			
			database
			.connectDB()
			.then(db => {
				var tasks = db.collection("tasks");
				var historiques = db.collection("historiques");
				return [tasks, historiques];
			})
			.then(([historiquesCollection]) => {
				historique = new Historique(historiquesCollection);
				
				var values = {};
				
				// try to find the new historique
				if (typeof historiqueID !== "undefined") {
					return historique.checkHistorique(historiqueID, userID).then(foundHistorique => {
						if (!foundHistorique) {
							return Promise.reject(new Error("LIST_NOT_EXIST"));
						}
						values.idHistorique = historiqueID;
						return [task, historique, values];
					});
				}
				
				return [task, historique, values];
			})
			.then(([task, historique, values]) => {
				return task
				.deleteTasks(historiqueID, { userID: userID })
				.then(deletedTasks => {
					return [historique, deletedTasks];
				});
			})
			.then(([historique, deletedTasks]) => {
				return historique
				.deleteHistorique(historiqueID, { userID: userID })
				.then(deletedHistorique => {
					return [deletedTasks.deletedCount, deletedHistorique];
				});
			})
			.then(([nbTasksDeleted, deletedHistorique]) => {
				// because we already check historiqueID exist, no need to recheck
				console.log("REMOVED LIST");
				return res.send(that.makeSuccess({
					nbTasksDeleted: nbTasksDeleted
				}));
			})
			.catch(err => {
				console.log(err);
				res.send(this.makeError(err.message));
				return;
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

module.exports.api = new ApiHistorique();
module.exports.router = router;