const fetchers = {
  story: require('./fetchers/story'),
  stories: require('./fetchers/stories'),
  links: require('./fetchers/links')
}

const initStoryblok = require('./storyblok-init')

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
        
        if(i-1 == -1) { // we reached the end of the list
          return links[links.length-1] || null
        }
				return links[i-1] || null
			}
		}
		return null
	},

	'getPrevStory': function(id, links) {
    if(id == 0) {
      return links[links.length-1]
    }

		for(var i=0; i<links.length; i++) {
			if(links[i].id == id) {
        if(i+1 == links.length) { // we reached the beginning of the list
          return links[0] || null
        }
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
  },

  'clearCache': function (cb) {
    initStoryblok(function(err, Storyblok) {
      Storyblok.flushCache()
      cb()
    })
  }
}
