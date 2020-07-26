const initContentful = require('../contentful-init')
const storyMapper = require('../mappers/story')

module.exports = function(options) {

	options = options || {}

	return new Promise((resolve, reject) => {

		initContentful('delivery')
			.then(client => {
				client.getEntries({ 'content_type': 'blogPost', 'order': '-fields.publishedDate' })
					.then(response => {
						resolve(response.items.map(storyMapper)) 
					})
					.catch(error => { reject(error) })
			})
			.catch(error => reject(error))

	})
}