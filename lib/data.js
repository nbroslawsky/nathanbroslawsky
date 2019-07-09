const fetchers = {
	story: require('./fetchers/story'),
	stories: require('./fetchers/stories')
}

module.exports = {
	'stories': function(req) {

		let options = {
			version: req.query._storyblok ? 'draft': 'published',
			sortBy: 'first_published_at:desc'
		}

		return function(cb) {
			fetchers.stories(options, function(err, stories) {
				if(err) return cb(err)
				cb(null, stories)
			})
		}
	},

	'story': function(req) {
		let options = {
			version: req.query._storyblok ? 'draft': 'published'
		}

		return function(cb) {
			fetchers.story(req.params.slug, options, function(err, story) {
				if(err) return cb(err)
				cb(null, story)
			})
		}
	},

	'getNextStory': function(id, stories) {
		for(var i=0; i<stories.length; i++) {
			if(stories[i].id == id) {
				return stories[i-1] || null
			}
		}
		return null
	},

	'getPrevStory': function(id, stories) {
		for(var i=0; i<stories.length; i++) {
			if(stories[i].id == id) {
				return stories[i+1] || null
			}
		}
		return null
	}
}