const initStoryblok = require('../storyblok-init')
const storyMapper = require('../mappers/story')

module.exports = function(options, cb) {

	if(typeof options == 'function') {
		cb = options
		options = {}
	}

	initStoryblok(function(err, Storyblok) {

		Storyblok
			.get(`cdn/stories`, {
				version: options.version,
				sort_by: options.sortBy
			})
			.then((response) => {
				cb(null, response.data.stories.map(storyMapper))
			})
			.catch((error) => {
				console.log(error)
				cb(error)
			})
	})
}