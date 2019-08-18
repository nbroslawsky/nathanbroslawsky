const moment = require('moment')
const marked = require('marked')
const sanitizeHtml = require('sanitize-html')

module.exports = function(story) {
	let publishedDate = moment(story.first_published_at)
	if (!publishedDate.isValid())
		publishedDate = moment()
	let markdown = getMarkdown(story)
	let description = getDescription(story)
	let html = marked(markdown)
	story.view = {
		'date': publishedDate.format('D'),
		'month': publishedDate.format('MMMM'),
		'year': publishedDate.format('YYYY'),
		'fulldate': publishedDate.format('MMMM Do, YYYY'),
		'html': html
	}

	story.preview = {
		sanitized: description || sanitizeHtml(html, { allowedTags: [] }).substr(0, 500),
		image: getImages(markdown),
		url: '/blog/' + story.full_slug
	}

	return story
}

function getMarkdown(story) {
	let content = (story || {}).content
	let body = (content || {}).body
	body = (body instanceof Array) ? body[0] : body
	let markdown = (body || {}).markdown

	return markdown || ''
}

function getDescription(story) {
	let content = (story || {}).content
	let body = (content || {}).body
	body = (body instanceof Array) ? body[0] : body
	let description = (body || {}).description

	return description || ''
}

function getImages(markdown) {
	let match = markdown.match(/\!\[.*?\]\((.*?)\)/) || []
	return match[1]
}