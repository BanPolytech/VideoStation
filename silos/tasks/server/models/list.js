const ObjectID = require("mongodb").ObjectID;
const sanitize = require("mongo-sanitize");

class List {
	constructor(collection) {
		const that = this;
		that.collection = collection;
	}
	
	createList(withName, ofUserID) {
		const that = this;
		return that.collection.insertOne({ userID: ofUserID, name: sanitize(withName) });
	}
	updateList(listID, filters, valuesToUpdate) {
		const that = this;
		if (!ObjectID.isValid(listID)) {
			return Promise.reject(new Error("INVALID_LIST_ID_FORMAT"));
		}
		var myQuery = { _id: new ObjectID(listID) };
		Object.assign(myQuery, filters);
		if (Object.keys(valuesToUpdate).length === 0 && valuesToUpdate.constructor === Object) {
			return Promise.reject(new Error("NO_PROPERTY_WAS_PROVIDED_TO_UPDATE"));
		}
		return that.collection.findOneAndUpdate(myQuery, { $set: valuesToUpdate }, { returnOriginal: false });
	}
	
	deleteList(listID, filters) {
		const that = this;
		if (!ObjectID.isValid(listID)) {
			return Promise.reject(new Error("INVALID_LIST_ID_FORMAT"));
		}
		var myQuery = { _id: new ObjectID(listID) };
		Object.assign(myQuery, filters);
		return that.collection.deleteOne(myQuery);
	}
	
	getLists(ofUserID) {
		const that = this;
		const query = { userID: ofUserID };
		return that.collection.find(query).toArray();
	}
	
	checkList(listID, userID) {
		const that = this;
		if (!ObjectID.isValid(listID)) {
			return Promise.reject(new Error("INVALID_LIST_ID_FORMAT"));
		}
		var myQuery = { _id: new ObjectID(listID), userID: userID };
		return that.collection.findOne(myQuery);
	}
}

module.exports = List;
