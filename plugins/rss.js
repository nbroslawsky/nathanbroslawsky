var path = require('path'),
	RSS = require('rss'),
	appDir = path.join(__dirname, '../app');

exports.attach = function(options) {

	var app = this;

	app.on('sections-updated', function() {
		Object.keys(app.sections).forEach(function(sectionName) {
			var section = app.sections[sectionName];

			/* lets create an rss feed */
			var feed = new RSS({
					title: 'Curiosity Was Framed',
					description: 'Blog for nathanbroslawsky.com: Curiosity Was Framed - Ignorance Killed the Cat',
					feed_url: 'http://www.nathanbroslawsky.com/rss.xml',
					site_url: 'http://www.nathanbroslawsky.com',
					image_url: 'http://www.nathanbroslawsky.com/images/curiosity.png',
					author: 'Nathan Broslawsky'
				});

			var blogData = app.sections.blog || {};
			Object.keys(blogData.pages || {}).forEach(function(pageKey) {
				var pageData = blogData.pages[pageKey];
				feed.item({
					title:  pageData.title,
					description: pageData.html,
					url: pageData.absUrl,
					date: pageData.fileData.modified
				});
			});

			section.xml = feed.xml();
		});
	});
};

exports.init = function(done) {
	done();
};
