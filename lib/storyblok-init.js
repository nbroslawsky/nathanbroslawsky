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

		console.error('err', err)
		console.log('data', data)

		if(err) return cb(404)

		privateKey = data['preview']
		if(privateKey) {
			return cb(null, privateKey)	
		} 

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