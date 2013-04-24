var express = require('express'),
	app = express();

module.exports = function(redirectTo, port, callback) {

	app.get('/', function(req, res, next) {
		res.writeHead(302, {'Location': redirectTo});
		res.end();
	});

	// if(callback) {
	// 	callback(app);
	// } else {
		app.listen(port);
		console.log('Listening on port ' + port);
		callback && callback(app);
	// }
};

if(!module.parent) { module.exports('http://www.google.com'); }
