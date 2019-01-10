const ObjectID = require("mongodb").ObjectID;
const sanitize = require("mongo-sanitize");

class Historique {
	constructor(collection) {
		const that = this;
		that.collection = collection;
	}
	
	createHistorique(ofUserID, query, date) {
		const that = this;
		return that.collection.insertOne({ userID: ofUserID, query: query, date: date});
	}
	updateHistorique(historiqueID, filters, valuesToUpdate) {
		const that = this;
		if (!ObjectID.isValid(historiqueID)) {
			return Promise.reject(new Error("INVALID_HISTORY_ID_FORMAT"));
		}
		var myQuery = { _id: new ObjectID(historiqueID) };
		Object.assign(myQuery, filters);
		if (Object.keys(valuesToUpdate).length === 0 && valuesToUpdate.constructor === Object) {
			return Promise.reject(new Error("NO_PROPERTY_WAS_PROVIDED_TO_UPDATE"));
		}
		return that.collection.findOneAndUpdate(myQuery, { $set: valuesToUpdate }, { returnOriginal: false });
	}
	
	deleteHistorique(historiqueID, filters) {
		const that = this;
		if (!ObjectID.isValid(historiqueID)) {
			return Promise.reject(new Error("INVALID_HISTORY_ID_FORMAT"));
		}
		var myQuery = { _id: new ObjectID(historiqueID) };
		Object.assign(myQuery, filters);
		return that.collection.deleteOne(myQuery);
	}
	
	getHistoriques(ofUserID) {
		const that = this;
		const query = { userID: ofUserID };
		return that.collection.find(query).sort({date: -1}).toArray();
	}
	
	checkHistorique(historiqueID, userID) {
		const that = this;
		if (!ObjectID.isValid(historiqueID)) {
			return Promise.reject(new Error("INVALID_HISTORY_ID_FORMAT"));
		}
		var myQuery = { _id: new ObjectID(historiqueID), userID: userID };
		return that.collection.findOne(myQuery);
	}
}

module.exports = Historique;
