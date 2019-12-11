const fs = require('fs')
const path = require('path')
const localPortPath = path.join(__dirname, '..', '.port')

module.exports = function() {

	var stat
	try {
		stat = fs.statSync(localPortPath)
	} catch(e) {
		stat = null
	}

	var port = 8080
	if(stat && stat.isFile()) {
		port = fs.readFileSync(localPortPath, 'utf8')
		port = port.trim()
	}

	return port
}