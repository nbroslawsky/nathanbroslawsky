var crypto = require('crypto'),
	shasum = crypto.createHash('sha1');

function User(userManager, data) {

	Object.defineProperty(this, "userManager", {
		enumerable: false,
		value: userManager
	});

	data = data || {};

	this.id = data.id || undefined;
	this.email = data.email || undefined;
	this.approved = data.email || undefined;
	this.name = data.name || undefined;
	this.passwordHash = data.passwordHash || undefined;

	this.logins = [];
}

function UserManager(app) {
	this.app = app;
}

UserManager.prototype = {
	getUsersCollection : function(callback) {
		this.app.db.collection('users', { safe : true }, function(err, collection) {
			callback(err, collection);
		});
	},
	getUser : function(id, callback) {
		var self = this;
		this.getUsersCollection(function(err, collection) {
			collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
				callback(err, new User(self, user));
			});
		});
	},
	addUser : function(name, email, password, approved, callback) {

		var user = new User();
			user.name = name;
			user.email = email;
			user.approved = approved;
			user.passwordHash = shasum.update(password).digest('hex');

		this.getUsersCollection(function(err, collection) {
			collection.insert(user, { safe : true }, function(err, result) {
				console.log(arguments);
				callback(err);
			});
		});
	}
};

module.exports = UserManager;