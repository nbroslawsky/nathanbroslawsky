var UserManager = require('./data/user.js');

module.exports = {
	index : function(req, res, next) {
		res.render('index');
	},
	login : function(req, res, next) {

		req.session.userId = undefined;
		req.user = undefined;

		var reasons = {
			password_mismatch : "Your passwords did not match. Please use the back button to try again.",
			no_reset : "We were unable to validate your account. Please try again.",
			success : "Your password was successfully changed. Please log in."
		};

		res.render('login', {
			redirectParam : req.query.go,
			reason : reasons[req.query.reason]
		});
	},
	authenticate : function(req, res, next) {
		var userManager = new UserManager(this);
		userManager.authenticate(req.body.email, req.body.password, function(err, user) {
			if(err) {
				res.writeHead(302, { 'Location': '/login?go=' + encodeURIComponent(req.body.go) });
				res.end();
			} else {
				req.session.userId = user._id;
				res.writeHead(302, { 'Location': req.body.go || '/' });
				res.end();
			}
		});
	},
	forgotPassword : function(req, res, next) {
		res.render('forgot-password');
	},
	sendPassword : function(req, res, next) {
		var userManager = new UserManager(this);
		userManager.flagPasswordReset(req.body.email, function(err) {
			res.writeHead(302, { 'Location': '/email-sent/' });
			res.end();
		});
	},
	emailSent : function(req, res, next) {
		res.render('email-sent');
	},
	changePassword : function(req, res, next) {
		var userManager = new UserManager(this);
		userManager.getFlaggedUser(req.query.email, req.query.flag, function(err) {
			if(err) {
				res.render('change-password-nouser');
			} else {
				res.render('change-password', { email : req.query.email, flag : req.query.flag });
			}
		});
	},
	submitPasswordChange : function(req, res, next) {

		var email = req.body.email,
			flag = req.body.flag,
			password = req.body.password,
			confirm = req.body.password_confirm;

		if(password != confirm) {
			res.writeHead(302, { 'Location': '/login/?reason=password_mismatch' });
			res.end();
			return;
		}

		var userManager = new UserManager(this);
		userManager.changePassword(email, flag, password, function(err) {
			if(err) {
				res.writeHead(302, { 'Location': '/login/?reason=no_reset' });
				res.end();
				return;
			}

			res.writeHead(302, { 'Location': '/login/?reason=success' });
			res.end();
		});
	}
};