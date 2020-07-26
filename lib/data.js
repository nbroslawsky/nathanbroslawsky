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

dataCalls.getNextStory = function(id) {

  return new Promise((resolve, reject) => {

    dataCalls.stories()
      .then(stories => {
        // iterate through and send back a story
        resolve(stories[0])
      })
      .catch(err => reject(err))
  })

}

dataCalls.getPrevStory = function(id) {

  return new Promise((resolve, reject) => {

    dataCalls.stories()
      .then(stories => {
        // iterate through and send back a story
        resolve(stories[0])
      })
      .catch(err => reject(err))
  })

}

module.exports = dataCalls

  /*
  // TODO: build caching mechanism

  'clearCache': function (cb) {
    initContentful(function(err, Storyblok) {
      Storyblok.flushCache()
      cb()
    })
  }*/
