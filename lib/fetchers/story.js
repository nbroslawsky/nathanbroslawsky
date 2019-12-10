const initStoryblok = require('../storyblok-init')
const storyMapper = require('../mappers/story')

module.exports = function(slug, options, cb) {

	if(typeof options == 'function') {
		cb = options
		options = {}
	}

	initStoryblok(function(err, Storyblok) {
		if (err) return cb(err)

		Storyblok
			.get(`cdn/stories/${slug}`, {
				version: options.version
			})
			.then((response) => {
				process.nextTick(function() {
					cb(null, storyMapper(response.data.story))
				})
			})
			.catch((error) => {
				console.log(error)
				cb(error)
			})
	})	
}
