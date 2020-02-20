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
          let linkKeyArray = Object.keys(links)
          let linksArray = linkKeyArray.map(function(key) { 

            let link = links[key] 
            link.preview = {
              url: '/blog/' + link.slug
            }
            return link
          })

          console.log(linksArray)
          let orderedLinks = linksArray.sort(function (a, b) { return a.position > b.position })
          console.log(orderedLinks)

          cb(null, orderedLinks)
        })
      })
      .catch((error) => {
        cb(error)
      })
  })
}
