const initContentful = require('../contentful-init')
const storyMapper = require('../mappers/story')
const cacher = require('../cacher')

module.exports = function(slug) {

	return new Promise((resolve, reject) => {

		let cacheKey = ['contentful','blogpost',slug].join('.')
		let cachedValue = cacher.get(cacheKey)

		if(cachedValue !== undefined) {
			return resolve(cachedValue)
		}

		initContentful('delivery')
			.then(client => {
				console.log(`Fetching blogPost ${slug} from Contentful`)
				client.getEntries({ 'fields.slug': slug, 'content_type': 'blogPost' })
					.then(response => {
						if(response.total !== 1) {
							return reject({ message: "The content API returned an invalid number of items: " + response.total })
						}
						let story = response.items[0] || {}
						let mappedStory = storyMapper(story)
						cacher.set(cacheKey, mappedStory)
						resolve(mappedStory) 
					})
					.catch(error => { reject(error) })
			})
			.catch(error => reject(error))

	})
}
