var path = require('path'),
	markdownBlog = require('markdown-blog'),
	async = require('async'),
	fs = require('fs');

exports.attach = function(options) {
	var app = this;

	app.sectionConfig = Object.keys(options.sections).reduce(function(init, section) {
		init[section] = {
			absUrl : path.join(options.base, section,'/'),
			title : options.sections[section]
		};
		return init;
	}, {});

};

exports.init = function(done) {

	var app = this;

	app.on('files-changed', function(files) {

		var toCompile = Object.keys(app.sectionConfig)
			.filter(function(section) {
				var sectionPath = app.sectionConfig[section].absUrl,
					sectionPathLength = sectionPath.length,
					filesChangedInSection = files.filter(function(file) {
						return file.substr(0,sectionPath.length) == sectionPath;
					});
				return !!filesChangedInSection.length;
			})
			.forEach(function(section) {

				markdownBlog.compile(app.sectionConfig[section].absUrl, function(err, mdBlog) {
					mdBlog.setTitle(app.sectionConfig[section].title);
					app.sections[section] = mdBlog;
				});

			});
	});

	async.parallel(
		Object.keys(app.sectionConfig).reduce(function(init, section) {

			var absPath = app.sectionConfig[section].absUrl;
			init[section.toLowerCase()] = function(cb) {
				fs.stat(absPath, function(err, stat) {
					err = err || (!stat.isDirectory() ? 'not a directory' : undefined);
					if(err) {
						return cb(err);
					}

					markdownBlog.compile(absPath, function(err, mdBlog) {
						mdBlog.setTitle(app.sectionConfig[section].title);
						cb(err, mdBlog);
					});
				});
			};

			return init;
		}, {}),
		function(err, results) {

			app.sections = results;
			app.emit('sections-loaded');

			done();
		}
	);
};