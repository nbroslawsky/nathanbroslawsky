var path = require('path'),
	RSS = require('rss'),
	url = require('url'),
	appDir = path.join(__dirname, '../app'),
	domain = 'http://www.nathanbroslawsky.com';

exports.attach = function(options) {

	var app = this;

	app.on('sections-updated', function() {
		Object.keys(app.sections).forEach(function(sectionName) {
			var section = app.sections[sectionName];

			/* lets create an rss feed */
			var feed = new RSS({
					title: 'Curiosity Was Framed',
					description: 'Blog for nathanbroslawsky.com: Curiosity Was Framed - Ignorance Killed the Cat',
					feed_url: domain + '/rss.xml',
					site_url: domain,
					image_url: domain + '/images/curiosity.png',
					author: 'Nathan Broslawsky'
				});

			var blogData = app.sections.blog || {};
			Object.keys(blogData.pages || {}).forEach(function(pageKey) {
				var pageData = blogData.pages[pageKey];
				feed.item({
					title:  pageData.title,
					description: pageData.html
						.replace(/(<img .*?src=)(['"])(.*?)(\3)/igm, "$1$2"+domain+"/$3$4")
						.replace(/(<a .*?href=)(['"])(?!https?:\/\/)(.*?)(\3)/igm, "$1$2"+domain+"/$3$4"),
					url: url.resolve(domain,pageData.absUrl),
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
