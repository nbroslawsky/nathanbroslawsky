const fs = require('fs'),
	path = require('path'),
	secretsManager = require('./secrets-manager'),
	localCredsPath = path.join(__dirname, '..', 'secrets/smtp.json'),
	keyName = 'nb-personal-website.ses.smtp',
	AWS = require('aws-sdk')

function getSMTPCredentials(cb) {

	var stat
	try {
		stat = fs.statSync(localCredsPath)	
	} catch(e) {
		stat = null
	}

	var creds = null
	if(stat && stat.isFile()) {
		creds = fs.readFileSync(localCredsPath, 'utf8')
		creds = creds.trim()
		creds = JSON.parse(creds)
		
		if(creds) {
			return cb(null, creds)
		}
	}

	secretsManager(keyName, function(err, data) {

		if(err) {
			console.error("Error fetching from SecretsManager: ", err)
			return cb(404)
		}

		data = (typeof data == 'string') ? JSON.parse(data) : data

		if(data) {
			return cb(null, data)	
		} 

		console.error("Could not find key value in SecretsManager response")
		return cb(404)
	})
}

module.exports = function(from, message, cb) {

	getSMTPCredentials(function(err, creds) {

		if(err) {
			console.error(err)
			return cb(err)
		}

		var ses = new AWS.SES()
		ses.sendEmail({
			Destination: {
				ToAddresses: [
					creds.to_address
				]
			},
			Message: {
				Body: {
					Text: {
						Charset: "UTF-8",
						Data: `The following is a message from ${from}:\n\n ${message}`
					}
				},
				Subject: {
					Charset: "UTF-8",
					Data: `New message through nathanbroslawsky.com from ${from}`
				}
			},
			Source: creds.from_address
		}, function(err, data) {
			if(err) {
				console.error(err, err.stack)
				return cb(err)
			}

			console.log(data)
			cb(null, data)
		})
	})

}