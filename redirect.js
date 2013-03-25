var express = require('express'),
	app = express();

module.exports = function(redirectTo, callback) {

	app.get('/', function(req, res, next) {
		res.writeHead(302, {'Location': redirectTo});
		res.end();
	});

	if(callback) {
		callback(app);
	} else {
		app.express.listen(80);
		console.log('Listening on port 80');
	}
};

if(!module.parent) { module.exports('http://www.google.com'); }