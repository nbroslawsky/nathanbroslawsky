module.exports = {
	index : function(req, res, next) {
		res.render('section-index', { section : this.sections[req.params.section] });
	},
	page : function(req, res, next) {
		var section = this.sections[req.params.section],
			pageData = section.pages[req.params.page];

		if(!pageData) { return next(); }

		res.render('section-page', {
			section : section,
			page : section.pages[req.params.page]
		});
	}
};