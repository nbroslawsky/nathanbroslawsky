var express = require('express');

exports.attach = function(options) {
	this.express = express();
};

exports.init = function(done) {
	done();
};