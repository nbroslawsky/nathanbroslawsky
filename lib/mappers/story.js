const moment = require('moment')
const sanitizeHtml = require('sanitize-html')
const documentToHtmlString = require('@contentful/rich-text-html-renderer').documentToHtmlString
const richTextTypes = require('@contentful/rich-text-types')
const BLOCKS = richTextTypes.BLOCKS
const INLINES = richTextTypes.INLINES
const PREVIEW_IMAGE_WIDTH = 358

module.exports = function(story) {

	let fields = story.fields

	let publishedDate = moment(fields.publishedDate)
	if (!publishedDate.isValid())
		publishedDate = moment()

	let description = fields.description
	let html = documentToHtmlString(fields.body, {
		renderNode: {
			[BLOCKS.EMBEDDED_ASSET]: (node) => {

				let data = node && node.data || {}
				let target = data.target || {}
				let fields = target.fields || {}
				let file = fields.file || {}

				return `<img src="${file.url}" title="${fields.title}" />`
			}
		}
	})
	story.view = {
		'date': publishedDate.format('D'),
		'month': publishedDate.format('MMMM'),
		'year': publishedDate.format('YYYY'),
		'fulldate': publishedDate.format('MMMM Do, YYYY'),
		'html': html

	}

	story.preview = {
		sanitized: description || sanitizeHtml(html, { allowedTags: [] }).substr(0, 500),
		image: getPreviewImage(fields.previewImage),
		url: '/blog/' + fields.slug,
		publishedDate: publishedDate.format(),
		title: fields.title
	}

	return story
}


function getPreviewImage(image) {

	let fields = (image || {}).fields || {}
	let file = fields.file || {}

	return file.url ? (file.url + '?w='+PREVIEW_IMAGE_WIDTH) : null
	
}