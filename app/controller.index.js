module.exports = {
	index : function(req, res, next) {
		res.render('index', { sections : this.sections });
	}
}