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

		initContentful()
			.then(client => {
				console.log(`Fetching blogPost ${slug} from Contentful`)
				client.getEntries({ 'fields.slug': slug, 'content_type': 'blogPost' })
					.then(response => {
						if(response.total === 0) {
							return reject({ status: 404, message: "The post could not be found" })
						}
						if(response.total > 1) {
							return reject({ status: 406, message: "The content API returned an invalid number of items: " + response.total })
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
