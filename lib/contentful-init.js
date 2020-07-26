const contentful = require('contentful')
const fs = require('fs')
const path = require('path')
const secretsManager = require('./secrets-manager')
const localKeyPath = path.join(__dirname, '..', 'secrets/contentful.key.json')
const localModePath = path.join(__dirname, '..', 'secrets/contentful-mode')
const keyName = 'contentful'
const _contentfulClientCache = {}

let privateKeyObj = null
let mode = null

function getContentfulMode() {

	if(mode) return mode;

	let stat
	try {
		stat = fs.statSync(localModePath)	
	} catch(e) {
		stat = null
	}

	if(stat && stat.isFile()) {
		mode = fs.readFileSync(localModePath, 'utf8')
		return mode
	}

	return 'delivery'
}

function getContentfulKey(cb) {

	if(privateKeyObj) return cb(null, privateKeyObj)

	let stat
	try {
		stat = fs.statSync(localKeyPath)	
	} catch(e) {
		stat = null
	}

	if(stat && stat.isFile()) {
		privateKeyObj = fs.readFileSync(localKeyPath, 'utf8')
		privateKeyObj = JSON.parse(privateKeyObj)
		if(privateKeyObj) {
			return cb(null, privateKeyObj)
		}
	}

	secretsManager(keyName, function(err, data) {

		if(err) {
			console.error("Error fetching from SecretsManager: ", err)
			return cb(404)
		}

		privateKeyObj = (typeof data == 'string') ? JSON.parse(data) : data
		if(privateKeyObj) {
			return cb(null, privateKeyObj)	
		} 

		console.error("Could not find key value in SecretsManager response")
		return cb(404)
	})
}

module.exports = function() {

	const mode = getContentfulMode()
	return new Promise((resolve, reject) => {
		getContentfulKey(function(err, keyObj) {
			if(err) {
				return reject(err)
			}

			let cacheKey = keyObj[mode]
			if(!_contentfulClientCache[cacheKey]) {

				let config = {
					space: keyObj.spaceid,
					accessToken: keyObj[mode]
				}
				if(mode === 'preview') { config.host = 'preview.contentful.com' }

				_contentfulClientCache[cacheKey] = contentful.createClient(config)
			}

			resolve(_contentfulClientCache[cacheKey])

		})
	})

}