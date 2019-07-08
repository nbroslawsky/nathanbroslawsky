const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()
const port = 8080
const marked = require('marked')
const async = require('async')
const dataCalls = require('./lib/data')
const favicon = require('serve-favicon')

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'http') {
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
    marked: function (text) {
      return marked(text)
    },
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    }
  }
}))

app.set('view engine', '.hbs')
app.use('/files', express.static(path.join(__dirname, 'static')))
app.use(favicon(path.join(__dirname, 'static', 'img', 'favicon.ico')))

app.get('/', function (req, res, next) {
  async.parallel({
    stories: dataCalls.stories(req)
  }, function (err, results) {
    if (err) return next(err)
    res.render('home', {
      title: 'Nathan Broslawsky | nathanbroslawsky.com',
      homeStories: results.stories.slice(0, 3),
      protocol: req.originalUrl,
      layout: 'redesign'
    })
  })
})

app.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'Nathan Broslawsky | nathanbroslawsky.com',
    protocol: req.originalUrl,
    layout: 'redesign'
  })
})

app.get('/blog', function (req, res, next) {
  async.parallel({
    stories: dataCalls.stories(req)
  }, function (err, results) {
    if (err) return next(err)
    res.render('masonry', {
      title: 'Blog | Nathan Broslawsky | nathanbroslawsky.com',
      stories: results.stories,
      params: req.query,
      layout: 'redesign'
    })
  })
})

app.get('/blog/:slug', function (req, res, next) {
  async.parallel({
    story: dataCalls.story(req)
  }, function (err, results) {
    if (err) return next(err)
    res.render('post', {
      title: results.story.name + ' | Nathan Broslawsky | nathanbroslawsky.com',
      story: results.story,
      params: req.query,
      layout: 'redesign'
    })
  })
})

app.get('*', function (req, res, next) {
  res.statusCode = 404
  res.render('404', {
    title: 'Page Not Found | Nathan Broslawsky | nathanbroslawsky.com',
    layout: 'redesign'
  })
})

app.listen(port, () => console.log(`nathanbroslawsky.com [${process.env.NODE_ENV}] is listening on port ${port}!`))
