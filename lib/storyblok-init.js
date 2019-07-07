const StoryblokClient = require('storyblok-js-client'),
	fs = require('fs'),
	path = require('path'),
	secretsManager = require('./secrets-manager'),
	localKeyPath = path.join(__dirname, '..', 'secrets/storyblok.key'),
	keyName = 'StoryBlok'

let privateKey = null

function getStoryblokKey(cb) {

	if(privateKey) return cb(null, privateKey)

	var stat = fs.statSync(localKeyPath)
	if(stat.isFile()) {
		privateKey = fs.readFileSync(localKeyPath, 'utf8')
		if(privateKey) return cb(null, privateKey)

		secretsManager(keyName, function(err, data) {
			privateKey = data['preview']
			if(privateKey) return cb(null, privateKey)

			cb(404)
		})
	}
}

module.exports = function(cb) {
	getStoryblokKey(function(err, key) {
		if(err) return cb(err)

		cb(null, new StoryblokClient({ accessToken: key }))
	})
}