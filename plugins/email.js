var nodemailer = require('nodemailer');

exports.attach = function(options) {

	var app = this;

	var smtpTransport = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: app.settings.emailuser,
			pass: app.settings.emailpass
		}
	});

	app.sendMail = function(params, callback) {
		params.from = "Tanya Broslawsky <tanya@tanyachef.com>";

		if(!params.to) { return callback({ message : "You must pass a recipient's email address as the 'to' parameter" }); }
		if(!params.subject) { return callback({ message : "You must pass a subject as the 'subject' parameter" }); }
		if(!params.text && !params.html) { return callback({ message : "You must pass the body text as the 'text' or 'html' parameters" }); }

		smtpTransport.sendMail(params, function(err, response){
			console.log(arguments);
			callback(err);
		});
	};
};

exports.init = function(done) {
	done();
};