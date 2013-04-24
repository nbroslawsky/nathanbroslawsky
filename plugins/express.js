var express = require('express'),
	path = require('path'),
	moment = require('moment');

exports.attach = function(options) {
	var app = this;

	app.express = express();
	app.express.set('views',path.join(__dirname, '../views'));
	app.express.set('view engine', 'jade');
	app.express.use(function(req, res, next) {
		console.log('Access: ' + req.url);
		next();
	});
	app.express.use(app.static(path.join(__dirname,'../public')));
	app.express.use(express.bodyParser());
	app.express.use(express.cookieParser());
	app.express.use(express.session({cookie: { path: '/', httpOnly: true, maxAge: null }, secret:app.settings.sessionkey}));
	app.express.use(function(req, res, next) {

		res.setViewData = function(data) {
			var _data = {};
			res.setViewData = function(data) {
				data = data || {};
				for(var name in data) { _data[name] = data[name]; }
				return _data;
			};

			return res.setViewData(data);
		};

		var _render = res.render;
		res.render = function(template, data, callback) {
			if(typeof(data) == 'function') {
				callback = data;
				data = null;
			}

			return _render.call(this, template, res.setViewData(data), callback);
		};

		next();
	});
	app.express.use(function(req, res, next) {

		res.setViewData({
			moment : moment,
			sections : app.sections,
			sectionConfig : app.sectionConfig
		});

		next();
	});
	app.express.use(app.express.router);
};

exports.init = function(done) {
	done();
};
