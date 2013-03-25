var express = require('express'),
	async = require('async'),
	app = express();


async.parallel([
	function(cb) {
		var server = require('./server.js');
		server(function(broadway) {
			app.use(express.vhost('nathanbroslawsky.com',broadway.express));
			cb();
		});
	},
	function(cb) {
		var server = require('./redirect.js');
		server('http://www.nathanbroslawsky.com',function(app) {
			app.use(express.vhost('blog.nsfive.com',app));
			cb();
		});
	},
	function(cb) {
		var server = require('./redirect.js');
		server('http://www.nathanbroslawsky.com',function(app) {
			app.use(express.vhost('nsfive.com',app));
			cb();
		});
	}
],

function() {
	app.listen(80);
	console.log('listening on port 80');
});

