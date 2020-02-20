const initStoryblok = require('../storyblok-init')
const linkMapper = require('../mappers/link')

module.exports = function (options, cb) {
  initStoryblok(function (err, Storyblok) {
    if (err) return cb(err)

    Storyblok
      .get(`cdn/links`, {
        version: options.version
      })
      .then((response) => {
        process.nextTick(function () {
          let links = response.data.links
          let orderedLinks = Object.keys(links)
            .map(function (key) { return linkMapper(links[key]) })
            .sort(function (a, b) { return a.position - b.position })

          cb(null, orderedLinks)
        })
      })
      .catch((error) => {
        cb(error)
      })
  })
}
