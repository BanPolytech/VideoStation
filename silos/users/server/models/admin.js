const ObjectID = require("mongodb").ObjectID;
const sanitize = require("mongo-sanitize");

class Admin {
  constructor(collection) {
    const that = this;
    that.collection = collection;
  }

  suspendUser(userId, isSuspend) {
      const that = this;

      if (!ObjectID.isValid(userId)) {
          return Promise.reject(new Error("INVALID_USER_ID_FORMAT"));
      }

      var myQuery = {
          _id: new ObjectID(userId)
      };
      return that.collection.findOneAndUpdate(myQuery, { $set: { suspend: isSuspend}}, {returnOriginal: false});
  }

}

module.exports = Admin;
