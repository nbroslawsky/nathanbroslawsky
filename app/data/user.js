var crypto = require('crypto'),
	BSON = require('mongodb').BSONPure;

function User(userManager, data) {

	Object.defineProperty(this, "userManager", {
		enumerable: false,
		value: userManager
	});

	var self = this;
	this.__defineSetter__("password", function(val){
		self.passwordHash = crypto.createHash('sha1').update(val).digest('hex');
    });

	data = data || {};

	this._id = data._id || undefined;
	this.isAdmin = data.isAdmin || false;
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

		if(id) {
			this.getUsersCollection(function(err, collection) {
				collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
					callback(err, new User(self, user));
				});
			});
		} else {
			callback(null, new User(self));
		}
	},
	authenticate : function(email, password, callback) {
		var user = new User(this);
			user.email = email;
			user.password = password;

		var self = this;
		this.getUsersCollection(function(err, collection) {
			collection.findOne({
				'email' : user.email,
				'passwordHash' : user.passwordHash
			}, function(err, user) {
				if(err || !user) {
					err = { message : 'User Not Found' };
				}
				callback(err, !err && new User(self, user));
			});
		});
	},
	addUser : function(user, callback) {

		var self = this;
		this.getUsersCollection(function(err, collection) {
			collection.insert(user, { safe : true }, function(err, result) {
				callback(err, new User(self, result && result[0]));
			});
		});
	}
};

module.exports = UserManager;