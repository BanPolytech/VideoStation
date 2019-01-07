const express = require("express");
const check = require("check-types");

const Database = require("./db");
const List = require("./models/list");
const Task = require("./models/task");

const router = express.Router();

class APIList {
	constructor() {
		router.get("/all", (req, res) => {
			var that = this;
			
			//get param
			var userID = JSON.parse(req.query.token).id;
			
			//check param
			if (!userID) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}
			
			var database = new Database();
			var list;
			
			database
			.connectDB()
			.then(db => {
				return db.collection("lists");
			})
			.then(listsCollection => {
				list = new List(listsCollection);
				return list.getLists(userID);
			})
			.then(allLists => {
				console.log("GET LISTS");
				return res.send(that.makeSuccess({ lists: allLists }));
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
			var idList, userID;
			
			try {
				idList = req.query.idList,
				userID = JSON.parse(req.query.token).id;
				
				if (!idList || !userID) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// idList check
			if (!check.string(idList) || 
			!check.nonEmptyString(idList) 
			) {
				res.send(this.makeError("NOT_VALID_LIST_ID"));
        		return;
			}
			
			var database = new Database();
			var task, list;
			
			database
			.connectDB()
			.then(db => {
				var tasks = db.collection("tasks");
				var lists = db.collection("lists");
				return [tasks, lists];
			})
			.then(([tasksCollection, listsCollection]) => {
				task = new Task(tasksCollection);
				list = new List(listsCollection);
				return list.checkList(idList, userID);
			})
			.then(foundList => {
				if (!foundList) {
					return Promise.reject(new Error("LIST_NOT_EXIST"));
				}
				return task.getTasks(idList, userID, null).then(allTasks => {
					foundList.tasks = allTasks;
					return res.send(that.makeSuccess({ list: foundList }));
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
			var name, userID;
			
			try {
				name = req.body.list.name;
				userID = req.body.token.id;
				
				if (!name || !userID) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// name check
			if (!check.string(name) || 
			!check.nonEmptyString(name) || 
			!check.match(name, /^\s*(\S\s*){1,25}$/)
			) {
				res.send(this.makeError("NOT_VALID_LIST_NAME"));
        		return;
			}
			
			var database = new Database();
			var list;
			
			database
			.connectDB()
			.then(db => {
				return db.collection("lists");
			})
			.then(listsCollection => {
				list = new List(listsCollection);
				return list.createList(name, userID);
			})
			.then(newList => {
				console.log("CREATED LIST");
				return res.send(that.makeSuccess({ list: newList.ops[0] }));
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
			var listID, newName, userID;
			
			try {
				listID = req.body.list.id;
				newName = req.body.list.name;
				userID = req.body.token.id;
				
				if (!listID || !userID) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// name check
			if (check.string(newName) && 
			(!check.nonEmptyString(newName) || 
			!check.match(newName, /^\s*(\S\s*){1,25}$/)
			)) {
				res.send(this.makeError("NOT_VALID_LIST_NAME"));
        		return;
			}
			
			var database = new Database();
			var task, list;
			
			database
			.connectDB()
			.then(db => {
				return db.collection("lists");
			})
			.then(listsCollection => {
				list = new List(listsCollection);
				
				var values = {};
				
				// add data to update
				if (newName) {
					values.name = newName;
				}
				
				// we will also check if task € user before update
				var otherFilter = { userID: userID };
				
				return list.updateList(listID, otherFilter, values);
			})
			.then(updatedList => {
				if (!updatedList.value) {
					return Promise.reject(new Error("LIST_NOT_EXIST"));
				}
				
				console.log("UPDATED LIST");
				return res.send(that.makeSuccess({ list: updatedList.value }));
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
			var listID = req.body.list.id;
			var userID = req.body.token.id;
			
			//check param
			if (!listID || !userID) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}
			
			var database = new Database();
			var task, list;
			
			database
			.connectDB()
			.then(db => {
				var tasks = db.collection("tasks");
				var lists = db.collection("lists");
				return [tasks, lists];
			})
			.then(([tasksCollection, listsCollection]) => {
				task = new Task(tasksCollection);
				list = new List(listsCollection);
				
				var values = {};
				
				// try to find the new list
				if (typeof listID !== "undefined") {
					return list.checkList(listID, userID).then(foundList => {
						if (!foundList) {
							return Promise.reject(new Error("LIST_NOT_EXIST"));
						}
						values.idList = listID;
						return [task, list, values];
					});
				}
				
				return [task, list, values];
			})
			.then(([task, list, values]) => {
				return task
				.deleteTasks(listID, { userID: userID })
				.then(deletedTasks => {
					return [list, deletedTasks];
				});
			})
			.then(([list, deletedTasks]) => {
				return list
				.deleteList(listID, { userID: userID })
				.then(deletedList => {
					return [deletedTasks.deletedCount, deletedList];
				});
			})
			.then(([nbTasksDeleted, deletedList]) => {
				// because we already check listID exist, no need to recheck
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

module.exports.api = new APIList();
module.exports.router = router;