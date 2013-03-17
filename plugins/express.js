var express = require('express'),
	path = require('path');

exports.attach = function(options) {
	this.express = express();
	this.express.set('views',path.join(__dirname, '../views'));
	this.express.set('view engine', 'jade');

	this.express.use(express.bodyParser());
	this.express.use(this.express.router);
};

exports.init = function(done) {
	done();
};