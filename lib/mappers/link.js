module.exports = function(link) {

  link.preview = {
    url: '/blog/' + link.slug
  }

  return link
}