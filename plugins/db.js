var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

exports.attach = function(options) {
	var server = new Server('localhost', 27017, {auto_reconnect: true});
	this.db = new Db('tanyachef', server, { w : 1 });
};

exports.init = function(done) {
	this.db.open(function(err, db) {
		if(err) { throw new Error('Unable to connect to tanyachef.com database!'); }

		console.log("Connected to tanyachef.com database");
		done();
	});
};