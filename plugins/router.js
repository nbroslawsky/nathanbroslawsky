var path = require('path');
var appDir = path.join(__dirname, '../app');

exports.attach = function(options) {

	var app = this,
		indexController = require(path.join(appDir, 'controller.index.js')),
		sectionController = require(path.join(appDir, 'controller.section.js'));

	app.express.get('/', indexController.index.bind(app));
	app.on('sections-loaded', function() {
		Object.keys(app.sections).forEach(function(section) {
			app.express.get('/' + section, function(req, res, next) {
				req.params.section = section;
				sectionController.index.apply(app, arguments);
			});
			app.express.get('/' + section + '/:page', function(req, res, next) {
				req.params.section = section;
				sectionController.page.apply(app, arguments);
			});
		});
	});
};

exports.init = function(done) {
	done();
};
