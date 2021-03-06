const StoryblokClient = require('storyblok-js-client'),
	fs = require('fs'),
	path = require('path'),
	secretsManager = require('./secrets-manager'),
	localKeyPath = path.join(__dirname, '..', 'secrets/storyblok.key'),
	keyName = 'StoryBlok'

const _storyblokClientCache = {}

let privateKey = null

function getStoryblokKey(cb) {

	if(privateKey) return cb(null, privateKey)

	var stat
	try {
		stat = fs.statSync(localKeyPath)	
	} catch(e) {
		stat = null
	}

	if(stat && stat.isFile()) {
		privateKey = fs.readFileSync(localKeyPath, 'utf8')
		privateKey = privateKey.trim()
		if(privateKey) {
			return cb(null, privateKey)
		}
	}

	secretsManager(keyName, function(err, data) {

		if(err) {
			console.error("Error fetching from SecretsManager: ", err)
			return cb(404)
		}

		data = (typeof data == 'string') ? JSON.parse(data) : data

		privateKey = data['preview']
		if(privateKey) {
			return cb(null, privateKey)	
		} 

		console.error("Could not find key value in SecretsManager response")
		return cb(404)
	})
}

module.exports = function(cb) {
	getStoryblokKey(function(err, key) {
		if(err) return cb(err)

		if(!_storyblokClientCache[key]) {
			_storyblokClientCache[key] = new StoryblokClient({
				accessToken: key,
				cache: {
					type: 'memory'
				}
			})
		}

		cb(null, _storyblokClientCache[key])
	})
}