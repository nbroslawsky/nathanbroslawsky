var path = require('path'),
	markdownBlog = require('markdown-blog'),
	async = require('async'),
	fs = require('fs');

exports.attach = function(options) {
	var app = this;
	app.srcPaths = options.sections.reduce(function(init, section) {
		init[section] = path.join(options.base, section,'/');
		return init;
	}, {});
};

exports.init = function(done) {


	var app = this;
	async.parallel(
		Object.keys(app.srcPaths).reduce(function(init, section) {

			var absPath = app.srcPaths[section];
			init[section.toLowerCase()] = function(cb) {
				fs.stat(absPath, function(err, stat) {
					err = err || (!stat.isDirectory() ? 'not a directory' : undefined);
					if(err) {
						return cb(err);
					}

					markdownBlog.compile(absPath, function(err, mdBlog) {
						cb(err, mdBlog);
					});
				});
			};

			return init;
		}, {}),
		function(err, results) {

			app.sections = results;
			done();
		}
	);

	app.on('files-changed', function(files) {

		var toCompile = Object.keys(app.srcPaths)
			.filter(function(section) {
				var sectionPath = app.srcPaths[section],
					sectionPathLength = sectionPath.length,
					filesChangedInSection = files.filter(function(file) {
						return file.substr(0,sectionPath.length) == sectionPath;
					});
				return !!filesChangedInSection.length;
			})
			.forEach(function(section) {

				markdownBlog.compile(app.srcPaths[section], function(err, mdBlog) {
					app.sections[section] = mdBlog;
				});

			});
	});

	done();
};