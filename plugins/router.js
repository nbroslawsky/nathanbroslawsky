var path = require('path'),
	appDir = path.join(__dirname, '../app');

exports.attach = function(options) {

	var app = this,
		indexController = require(path.join(appDir, 'controller.index.js')),
		sectionController = require(path.join(appDir, 'controller.section.js'));

	app.express.get('/', indexController.index.bind(app));
	app.express.get('/rss.xml', indexController.rss.bind(app));

	app.on('sections-loaded', function() {

		Object.keys(app.sections).forEach(function(section) {

			var urlBase = '/' + section,
				sectionAbsPath = app.sections[section].path,
				addSectionParam = function(req, res, next) {
					req.params.section = section;
					next();
				};

			app.express.get(new RegExp(urlBase + '/.*'), app.static(sectionAbsPath, { urlBase : urlBase }));
			app.express.get(urlBase, addSectionParam, sectionController.index.bind(app));
			app.express.get(urlBase + '/:page', addSectionParam, sectionController.page.bind(app));
		});



	});
};

exports.init = function(done) {
	done();
};
