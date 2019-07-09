const fetchers = {
  story: require('./fetchers/story'),
  stories: require('./fetchers/stories'),
  links: require('./fetchers/links')
}

module.exports = {
  'stories': function (req) {
    let options = {
      version: req.query._storyblok ? 'draft' : 'published',
      sortBy: 'position:asc'
    }

    return function (cb) {
      fetchers.stories(options, function (err, stories) {
        if (err) return cb(err)
        cb(null, stories)
      })
    }
  },

  'story': function (req) {
    let options = {
      version: req.query._storyblok ? 'draft' : 'published'
    }

    return function (cb) {
      fetchers.story(req.params.slug, options, function (err, story) {
        if (err) return cb(err)
        cb(null, story)
      })
    }
  },

	'getNextStory': function(id, links) {
		for(var i=0; i<links.length; i++) {
			if(links[i].id == id) {
				return links[i-1] || null
			}
		}
		return null
	},

	'getPrevStory': function(id, links) {
		for(var i=0; i<links.length; i++) {
			if(links[i].id == id) {
				return links[i+1] || null
			}
		}
		return null
	},

  'links': function (req) {
    let options = {
      version: req.query._storyblok ? 'draft' : 'published'
    }

    return function (cb) {
      fetchers.links(options, function (err, links) {
        if (err) return cb(err)
        cb(null, links)
      })
    }
  }
}
