const moment = require('moment')
const sanitizeHtml = require('sanitize-html')
const documentToHtmlString = require('@contentful/rich-text-html-renderer').documentToHtmlString
const richTextTypes = require('@contentful/rich-text-types')
const BLOCKS = richTextTypes.BLOCKS
const INLINES = richTextTypes.INLINES
const PREVIEW_IMAGE_WIDTH = 358
const marked = require('marked')


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

				if(!file.url) {
					return
				}

				return `<img class="content-img" src="https:${file.url}" title="${fields.title}" />`
			},
			[BLOCKS.EMBEDDED_ENTRY]: (node) => {

				let target = node.data.target || {}
				let contentType = target.sys.contentType.sys.id
				if(contentType == 'markdownEmbed') {
					var content = target.fields.content || ''
					var html = marked(content)
					return html
				}

				if(contentType == 'linkedImage') {
					let imageFields = target.fields.image.fields
					let file = imageFields.file || {}
					let html = (target.fields.url)
						? `<a href="${target.fields.url}"><img class="content-img" src="https:${file.url}" title="${imageFields.title}" /></a>`
						: `<img class="content-img" src="https:${file.url}" title="${imageFields.title}" />`

					if(target.fields.author) {
						html += (target.fields.creditUrl)
							? `<cite>Photo by <a href="${target.fields.creditUrl}">${target.fields.author}</a></cite>`
							: `<cite>Photo by ${target.fields.author}</cite>`
					}

					return html
				}

				return
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

	return file.url ? ('https:' + file.url + '?w='+PREVIEW_IMAGE_WIDTH) : null
	
}