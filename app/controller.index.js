module.exports = {
	index : function(req, res, next) {
		res.render('index');
	},
	login : function(req, res, next) {
		res.render('login', { redirectParam : req.query.go });
	},
	authenticate : function(req, res, next) {

	}
}