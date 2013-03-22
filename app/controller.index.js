var UserManager = require('./data/user.js');

module.exports = {
	index : function(req, res, next) {
		res.render('index');
	},
	login : function(req, res, next) {
		res.render('login', { redirectParam : req.query.go });
	},
	authenticate : function(req, res, next) {
		var userManager = new UserManager(this);
		userManager.authenticate(req.body.email, req.body.password, function(err, user) {
			if(err) {
				res.writeHead(302, { 'Location': '/login?go=' + encodeURIComponent(req.body.go) });
				res.end();
			} else {
				req.session.userId = user._id;
				console.log('session', req.session.userId);
				res.writeHead(302, { 'Location': req.body.go });
				res.end();
			}
		});
	}
};