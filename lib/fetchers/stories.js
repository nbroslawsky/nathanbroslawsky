const initStoryblok = require('../storyblok-init')
const storyMapper = require('../mappers/story')

module.exports = function(options, cb) {

	initStoryblok(function(err, Storyblok) {
		if (err) return cb(err)

		Storyblok
			.get(`cdn/stories`, {
				version: options.version,
				sort_by: options.sortBy
			})
			.then((response) => {
				process.nextTick(function() {
					cb(null, response.data.stories.map(storyMapper))
				})
			})
			.catch((error) => {
				cb(error)
			})
	})
}