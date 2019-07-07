const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()
const port = 8080
const url = require('url')
const marked = require('marked')
const async = require('async')
const dataCalls = require('./lib/data')

app.use((req, res, next) => {
	if(req.headers['x-forwarded-proto'] == 'http') {
		console.log('x-forwarded-proto', req.headers['x-forwarded-proto'])
		res.redirect('https://' + req.headers.host + req.url)
	} else {
		next()
	}
})

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: 'views/components/',
  helpers: {
  	marked: function(text) {
  		return marked(text)
  	},
  	section: function(name, options) {
		if(!this._sections) this._sections = {};
		this._sections[name] = options.fn(this);
		return null;
  	}
  }
}))

app.set('view engine', '.hbs')
app.use('/files', express.static(path.join(__dirname, 'static')))

app.get('/', function(req, res) {

	async.parallel({
		stories: dataCalls.stories(req)
	}, function(err, results) {
		res.render('home', {
			title: 'Nathan Broslawsky | nathanbroslawsky.com',
			stories: results.stories,
			homeStories: results.stories.slice(0,3),
			protocol: req.originalUrl, 
			layout: 'redesign'
		})
	})
})

app.get('/about', function(req, res) {

	async.parallel({
		stories: dataCalls.stories(req)
	}, function(err, results) {
		res.render('about', {
			title: 'Nathan Broslawsky | nathanbroslawsky.com',
			stories: results.stories,
			protocol: req.originalUrl, 
			layout: 'redesign'
		})
	})
})

app.get('/blog', function(req, res) {

	async.parallel({
		stories: dataCalls.stories(req)
	}, function(err, results) {
		res.render('masonry', {
			title: 'Blog | Nathan Broslawsky | nathanbroslawsky.com',
			stories: results.stories,
			params: req.query,
			layout: 'redesign'
		})
	})
})

app.get('/blog/:slug', function(req, res) {

	async.parallel({
		story: dataCalls.story(req),
		stories: dataCalls.stories(req)
	}, function(err, results) {
		res.render('post', {
			title: results.story.name + ' | Nathan Broslawsky | nathanbroslawsky.com',
			stories: results.stories,
			story: results.story,
			params: req.query,
			layout: 'redesign'
		})
	})
})

app.listen(port, () => console.log(`nathanbroslawsky.com is listening on port ${port}!`))