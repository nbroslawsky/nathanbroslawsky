const initContentful = require('../contentful-init')
const storyMapper = require('../mappers/story')
const cacher = require('../cacher')

module.exports = function() {

	return new Promise((resolve, reject) => {

		let cacheKey = ['contentful','blogposts'].join('.')
		let cachedValue = cacher.get(cacheKey)

		if(cachedValue !== undefined) {
			return resolve(cachedValue)
		}

		initContentful('delivery')
			.then(client => {
				console.log(`Fetching blogPosts from Contentful`)
				client.getEntries({ 'content_type': 'blogPost', 'order': '-fields.publishedDate' })
					.then(response => {
						let mappedStories = response.items.map(storyMapper)
						cacher.set(cacheKey, mappedStories)
						resolve(mappedStories) 
					})
					.catch(error => { reject(error) })
			})
			.catch(error => reject(error))

	})
}