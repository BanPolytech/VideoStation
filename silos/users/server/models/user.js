const ObjectID = require("mongodb").ObjectID;
const sanitize = require("mongo-sanitize");

class User {
  constructor(collection) {
    const that = this;
    that.collection = collection;
  }

  createUser(email, passwordHashed) {
    const that = this;
    return that.collection.insertOne(
        {
            email: sanitize(email),
            password: passwordHashed,
            suspend: 0,
            admin: 0,
        });
  }

  findUserById(id) {
    const that = this;
    return new Promise((resolve, reject) => {
      if (!ObjectID.isValid(id)) {
        reject(new Error("INVALID_ID_FORMAT"));
	  } 
	  return that.collection.findOne(ObjectID(id));
    });
  }

  findUserByEmail(email) {
    const that = this;
    if (!email) {
		return Promise.reject(new Error("INVALID_EMAIL"));
	  }
	return that.collection.findOne({ email: sanitize(email) });
  }
}

module.exports = User;
