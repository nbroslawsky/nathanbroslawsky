var broadway = require('broadway'),
	app = new broadway.App(),
	path = require('path');

var pathToDropbox = '/home/nbroslawsky/Dropbox/nathanbroslawsky.com',
	siteSections = { 'Blog' : true };


module.exports = function(callback) {

	app.use(require('./plugins/static'));
	app.use(require('./plugins/settings'));
	app.use(require('./plugins/email'));
	app.use(require('./plugins/watcher'), { path : pathToDropbox, recursive : true });
	app.use(require('./plugins/express'));
	app.use(require('./plugins/blog-sections'), { base : pathToDropbox, sections : siteSections });
	app.use(require('./plugins/router'), { base : pathToDropbox, sections : Object.keys(siteSections) });
	app.use(require('./plugins/rss'));

	app.init(function(err) {
		if(err) { throw new Error(err); }


		// if(callback) {
		// 	callback(app);
		// } else {
			app.express.listen(3001);
			console.log('Listening on port 3001');
			callback && callback(app)
		// }
	});

};

if(!module.parent) { module.exports(); }
