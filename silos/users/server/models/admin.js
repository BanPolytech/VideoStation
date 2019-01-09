const ObjectID = require("mongodb").ObjectID;
const sanitize = require("mongo-sanitize");

class Admin {
  constructor(collection) {
    const that = this;
    that.collection = collection;
  }

  createUser(email, passwordHashed, enabled, admin) {
      const that = this;
      return that.collection.insertOne(
          {
              email: sanitize(email),
              password: passwordHashed,
              suspend: enabled,
              admin: admin,
          });
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

  toggleAdmin(userId, isAdmin) {
      const that = this;
      var toAdmin = 0;

      if (!ObjectID.isValid(userId)) {
          return Promise.reject(new Error("INVALID_USER_ID_FORMAT"));
      }

      toAdmin = (isAdmin)?0:1;

      var myQuery = {
          _id: new ObjectID(userId)
      };
      return that.collection.findOneAndUpdate(
          myQuery,
          { $set: { admin: toAdmin}},
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
