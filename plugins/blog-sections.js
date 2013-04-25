var path = require('path'),
	markdownBlog = require('markdown-blog'),
	async = require('async'),
	fs = require('fs');

function sortSection(section) {
	var newPages = {};
	section.pages = Object.keys(section.pages)
		.map(function(key) { return { key : key, page : section.pages[key] }; })
		.sort(function(a,b) { return Date.parse(b.page.fileData.modified) - Date.parse(a.page.fileData.modified); })
		.reduce(function(init,v) { init[v.key] = v.page; return init;  },{});
}

exports.attach = function(options) {
	var app = this;

	var sections = Object.keys(options.sections);
	app.sectionConfig = sections.reduce(function(init, section) {
		init[section] = {
			absPath : path.join(options.base, section,'/'),
			title : section,
			iterable : options.sections[section]
		};
		return init;
	}, {});

};

exports.init = function(done) {

	var postProcessorsToRun = markdownBlog.PostProcessors.imgsrc | markdownBlog.PostProcessors.href;

	var app = this;

	app.on('files-changed', function(files) {

		console.log('files-changed: ', files.join(', '));

		var toCompile = Object.keys(app.sectionConfig)
			.filter(function(section) {
				var sectionPath = app.sectionConfig[section].absPath,
					sectionPathLength = sectionPath.length,
					filesChangedInSection = files.filter(function(file) {
						return file.substr(0,sectionPath.length) == sectionPath;
					});
				return !!filesChangedInSection.length;
			})
			.forEach(function(section) {

				var sectionUrl = markdownBlog.sanitizeUrl(section);
				markdownBlog.compile(app.sectionConfig[section].absPath, postProcessorsToRun, function(err, mdBlog) {
					mdBlog.setTitle(app.sectionConfig[section].title);
					mdBlog.setDirectory(sectionUrl);
					this.replacePlaceholders({'ROOT_PATH' : '/'+sectionUrl });
					sortSection(mdBlog);
					app.sections[sectionUrl] = mdBlog;
				});

			});

			app.emit('sections-updated');
	});

	async.parallel(
		Object.keys(app.sectionConfig).reduce(function(init, section) {

			var absPath = app.sectionConfig[section].absPath,
				sectionUrl = markdownBlog.sanitizeUrl(section);

			app.sectionConfig[section].path = sectionUrl;

			init[sectionUrl] = function(cb) {
				fs.stat(absPath, function(err, stat) {
					err = err || (!stat.isDirectory() ? 'not a directory' : undefined);
					if(err) {
						return cb(err);
					}

					markdownBlog.compile(absPath, postProcessorsToRun, function(err, mdBlog) {
						mdBlog.setTitle(app.sectionConfig[section].title);
						mdBlog.setDirectory(sectionUrl);
						this.replacePlaceholders({'ROOT_PATH' : '/'+sectionUrl });
						cb(err, mdBlog);
					});
				});
			};

			return init;
		}, {}),
		function(err, results) {

			Object.keys(results).forEach(function(section) { sortSection(results[section]); });

			app.sections = results;
			app.emit('sections-updated');
			app.emit('sections-loaded');
			done();
		}
	);
};
