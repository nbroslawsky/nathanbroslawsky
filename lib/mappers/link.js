module.exports = function(link) {

  link.preview = {
    url: '/p/' + link.slug
  }

  return link
}