var path = require('path'),
	appDir = path.join(__dirname, '../app');

exports.attach = function(options) {

	var app = this,
		indexController = require(path.join(appDir, 'controller.index.js')),
		sectionController = require(path.join(appDir, 'controller.section.js'));

	app.express.get('/', app.auth, indexController.index.bind(app));
	app.express.get('/login', indexController.login.bind(app));
	app.express.post('/authenticate', indexController.authenticate.bind(app));

	app.on('sections-loaded', function() {

		Object.keys(app.sections).forEach(function(section) {

			var urlBase = '/' + section,
				sectionAbsPath = app.sections[section].path,
				addSectionParam = function(req, res, next) {
					req.params.section = section;
					next();
				};

			app.express.get(new RegExp(urlBase + '/.*'), app.auth, app.static(sectionAbsPath, { urlBase : urlBase }));
			app.express.get(urlBase, app.auth, addSectionParam, sectionController.index.bind(app));
			app.express.get(urlBase + '/:page', app.auth, addSectionParam, sectionController.page.bind(app));
		});



	});
};

exports.init = function(done) {
	done();
};
