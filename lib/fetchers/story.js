const initContentful = require('../contentful-init')
const storyMapper = require('../mappers/story')

module.exports = function(slug, options) {

	options = options || {}

	return new Promise((resolve, reject) => {

		initContentful('delivery')
			.then(client => {
				client.getEntries({ 'fields.slug': slug, 'content_type': 'blogPost' })
					.then(response => {
						if(response.total !== 1) {
							return reject({ message: "The content API returned an invalid number of items: " + response.total })
						}
						let story = response.items[0] || {}
						resolve(storyMapper(story)) 
					})
					.catch(error => { reject(error) })
			})
			.catch(error => reject(error))

	})
}
