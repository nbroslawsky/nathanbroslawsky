const cacher = require('./cacher')

const fetchers = {
  story: require('./fetchers/story'),
  stories: require('./fetchers/stories')
}

const initContentful = require('./contentful-init')

const dataCalls = {}

dataCalls.stories = function() { //358
  let options = {}

  return new Promise((resolve, reject) => {
    fetchers.stories(options)
      .then(stories => resolve(stories))
      .catch(error => reject(error))
  })
}

dataCalls.story = function(slug) {
  let options = {}

  return new Promise((resolve, reject) => {
    fetchers.story(slug, options)
      .then(story => resolve(story))
      .catch(err => reject(err))
  })
}

dataCalls.getNextStory = function(slug) {

  return new Promise((resolve, reject) => {

    dataCalls.stories()
      .then(stories => {
        // iterate through and send back a story
        for(let i=0; i<stories.length; i++) {
          if(stories[i].fields.slug === slug) {

            if(i == 0) { 
              return resolve(null) // beginning of the list
            }
            return resolve(stories[i-1])
          }
        }
        return resolve(null)
      })
      .catch(err => reject(err))
  })

}

dataCalls.getPrevStory = function(slug) {

  return new Promise((resolve, reject) => {

    dataCalls.stories()
      .then(stories => {
        // iterate through and send back a story
        for(let i=0; i<stories.length; i++) {
          if(stories[i].fields.slug === slug) {

            if(i+1 == stories.length) {
              return resolve(null)  // end of the list
            }
            return resolve(stories[i+1])
          }
        }
        return resolve(null)
      })
      .catch(err => reject(err))
  })

}

dataCalls.clearCache = function() {
  cacher.flushAll()
}

module.exports = dataCalls