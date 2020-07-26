const contentful = require('contentful')
const fs = require('fs')
const path = require('path')
const secretsManager = require('./secrets-manager')
const localKeyPath = path.join(__dirname, '..', 'secrets/contentful.key.json')
const keyName = 'contentful'
const _contentfulClientCache = {}
const PREVIEW = 'preview'

let privateKeyObj = null

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

		data = (typeof data == 'string') ? JSON.parse(data) : data

		privateKeyObj = data[PREVIEW]
		if(privateKeyObj) {
			return cb(null, privateKeyObj)	
		} 

		console.error("Could not find key value in SecretsManager response")
		return cb(404)
	})
}

module.exports = function(mode) {

	return new Promise((resolve, reject) => {
		getContentfulKey(function(err, keyObj) {
			if(err) {
				return reject(err)
			}

			let cacheKey = keyObj[mode]
			if(!_contentfulClientCache[cacheKey]) {
				_contentfulClientCache[cacheKey] = contentful.createClient({
					space: keyObj.spaceid,
					accessToken: keyObj[mode]
				})
			}

			resolve(_contentfulClientCache[cacheKey])

		})
	})

}