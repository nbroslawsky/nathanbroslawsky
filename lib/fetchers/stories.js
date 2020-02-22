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
					var mappedStories = response.data.stories.map(storyMapper)
					if(options.proxyImages) {

						mappedStories.forEach(function(story) {
							if(story.preview.image) {
								story.preview.originalImage = story.preview.image
								story.preview.image = story.preview.image.replace('a.storyblok.com/f/62413', 'nathanbroslawsky.imgix.net')

								if(options.proxyImages.width) {
									story.preview.image += '?w=' + options.proxyImages.width
								}


							}
						})
					}
					cb(null, mappedStories)
				})
			})
			.catch((error) => {
				cb(error)
			})
	})
}