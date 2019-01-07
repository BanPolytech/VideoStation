const express = require("express");
const check = require("check-types");

const Database = require("./db");
const Task = require("./models/task");
const List = require("./models/list");

const router = express.Router();

class APITask {
	constructor() {
		router.get("/all", (req, res) => {
			
			var that = this;
			
			//get param
			var idList, taskStatus, userID;
			
			try {
				idList = req.query.idList,
				taskStatus = req.query.isDone,
				userID = JSON.parse(req.query.token).id;
				
				if (!idList || !userID) throw "";
			} catch (e) {
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
				return list.checkList(idList, userID);
			})
			.then(foundList => {
				if (!foundList) {
					return Promise.reject(new Error("LIST_NOT_EXIST"));
				}
				return task.getTasks(idList, userID, taskStatus);
			})
			.then(allTasks => {
				console.log("GET TASKS");
				return res.send(that.makeSuccess({ tasks: allTasks }));
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
			var idList, name, userID;
			
			try {
				idList = req.body.task.idList;
				name = req.body.task.name;
				userID = req.body.token.id;
				
				if (!idList || !userID || !name) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// name check
			if (!check.string(name) || 
			!check.nonEmptyString(name) || 
			!check.match(name, /^\s*(\S\s*){1,25}$/)
			) {
				res.send(this.makeError("NOT_VALID_TASK_NAME"));
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
				return task.createTask(idList, userID, name);
			})
			.then(newTask => {
				console.log("CREATED TASK");
				return res.send(that.makeSuccess({ task: newTask.ops[0] }));
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
			var taskID, newName, newIDList, newStatus, userID;
			
			try {
				taskID = req.body.task.id;
				newName = req.body.task.name;
				newIDList = req.body.task.idList;
				newStatus = req.body.task.isDone;
				userID = req.body.token.id;
				
				if (!taskID || !userID) throw "";
			} catch (e) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}

			// name check
			console.log(check.string(newName));
			console.log(!check.nonEmptyString(newName));
			console.log(check.string(newName));
			if (check.string(newName) && 
			(!check.nonEmptyString(newName) || 
			!check.match(newName, /^\s*(\S\s*){1,25}$/)
			)) {
				res.send(this.makeError("NOT_VALID_TASK_NAME"));
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
				if (typeof newIDList !== 'undefined') {
					return list.checkList(newIDList, userID).then(foundList => {
						if (!foundList) {
							return Promise.reject(new Error("LIST_NOT_EXIST"));
						}
						values.idList = newIDList;
						return values;
					});
				}
				
				return values;
			})
			.then(values => {
				
				// add data to update
				if (newName) {
					values.name = newName;
				}
				if (newStatus !== undefined) {
					values.isDone = newStatus;
				}
				
				// we will also check if task € user before update
				var otherFilter = {
					userID: userID
				};
				
				return task.updateTask(taskID, otherFilter, values);
				
			})
			.then(updatedTask => {
				
				if (!updatedTask.value) {
					return Promise.reject(new Error("TASK_NOT_EXIST"));
				}
				
				console.log("UPDATED TASK");
				return res.send(that.makeSuccess({
					task: updatedTask.value
				}));
			})
			.catch(err => {
				console.log(err);
				res.send(this.makeError(err.message));
				return;
			})
			.then(function () {
				database.closeDB();
			});
			
		});
		
		router.post("/delete", (req, res) => {
			var that = this;
			
			//get param
			var taskID = req.body.task.id;
			var userID = req.body.token.id;
			
			//check param
			if (!taskID || !userID) {
				res.send(this.makeError("MISSING_PARAMS"));
				return;
			}
			
			var database = new Database();
			var task;
			
			database
			.connectDB()
			.then(db => {
				return db.collection("tasks");
			})
			.then(tasksCollection => {
				task = new Task(tasksCollection);
				
				// we will also check if task € user before update
				var otherFilter = { userID: userID };
				
				return task.deleteTask(taskID, otherFilter);
			})
			.then(deletedTask => {
				// TASK_NOT_EXIST
				if (deletedTask.deletedCount == 0) {
					res.send(this.makeError("TASK_NOT_EXIST"));
					return;
				}
				
				console.log("REMOVED TASK");
				return res.send(that.makeSuccess());
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

module.exports.api = new APITask();
module.exports.router = router;