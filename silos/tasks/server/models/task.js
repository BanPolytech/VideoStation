const ObjectID = require("mongodb").ObjectID;
const sanitize = require("mongo-sanitize");

class Task {
	constructor(collection) {
		const that = this;
		that.collection = collection;
	}
	
	createTask(idList, userID, taskLabel) {
		const that = this;
		const task = {
			idList: idList,
			userID: userID,
			name: sanitize(taskLabel),
			isDone: false
		};
		return that.collection.insertOne(task);
	}
	
	updateTask(taskID, filters, newTaskValues) {
		const that = this;
		if (!ObjectID.isValid(taskID)) {
			return Promise.reject(new Error("INVALID_TASK_ID_FORMAT"));
		}
		var myQuery = {
			_id: new ObjectID(taskID)
		};
		Object.assign(myQuery, filters);
		if (Object.keys(newTaskValues).length === 0 && newTaskValues.constructor === Object) {
			return Promise.reject(new Error("NO_PROPERTY_WAS_PROVIDED_TO_UPDATE"));
		}
		return that.collection.findOneAndUpdate(myQuery, { $set: newTaskValues }, { returnOriginal: false });
	}
	
	deleteTask(taskID, filters) {
		const that = this;
		if (!ObjectID.isValid(taskID)) {
			return Promise.reject(new Error("INVALID_TASK_ID_FORMAT"));
		}
		var myQuery = { _id: new ObjectID(taskID) };
		Object.assign(myQuery, filters);
		return that.collection.deleteOne(myQuery);
	}
	
	deleteTasks(listID, filters) {
		const that = this;
		if (!ObjectID.isValid(listID)) {
			return Promise.reject(new Error("INVALID_LIST_ID_FORMAT"));
		}
		var myQuery = { idList: listID };
		Object.assign(myQuery, filters);
		return that.collection.deleteMany(myQuery);
	}
	
	getTasks(listID, userID, status) {
		const that = this;
		if (!ObjectID.isValid(listID)) {
			return Promise.reject(new Error("INVALID_LIST_ID_FORMAT"));
		}
		const query = { idList: sanitize(listID), userID: userID };
		if (typeof status === "boolean") {
			query.isDone = status;
		}
		return that.collection.find(query).toArray();
	}
}

module.exports = Task;