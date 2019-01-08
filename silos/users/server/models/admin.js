const ObjectID = require("mongodb").ObjectID;
const sanitize = require("mongo-sanitize");

class Admin {
  constructor(collection) {
    const that = this;
    that.collection = collection;
  }

  toggleSuspend(userId, isSuspend) {
      const that = this;
      var toSuspend = 0;

      if (!ObjectID.isValid(userId)) {
          return Promise.reject(new Error("INVALID_USER_ID_FORMAT"));
      }

      toSuspend = (isSuspend)?0:1;

      var myQuery = {
          _id: new ObjectID(userId)
      };
      return that.collection.findOneAndUpdate(
          myQuery,
          { $set: { suspend: toSuspend}},
          { returnOriginal: false}
          );
  }

  getAllUsers() {
      const that = this;
      return that.collection.find().toArray();
  }

  searchUser(query) {
      const that = this;
      return that.collection.find(
          { "email" : { $regex: query}}
      ).toArray();
  }

}

module.exports = Admin;
