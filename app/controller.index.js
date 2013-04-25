module.exports = {
	index : function(req, res, next) {
		res.render('index');
	},
	rss : function(req, res, next) {
		var app = this;

		// cache the xml
		res.writeHead(200, { 'Content-Type': 'application/rss+xml' });
		res.write(app.sections.blog.xml);
		res.end();
	}
};