const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()
const port = require('./lib/get-port')()
const async = require('async')
const dataCalls = require('./lib/data')
const favicon = require('serve-favicon')
const setupFeed = require('./lib/setup-feed')

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'http') {
    console.log('x-forwarded-proto', req.headers['x-forwarded-proto'])
    res.redirect('https://' + req.headers.host + req.url)
  } else {
    next()
  }
})

app.use((req, res, next) => {
  if(req.headers.host === 'nathanbroslawsky.com') { // that is, without the www.
    res.redirect('https://www.' + req.headers.host + req.url)
  } else {
    next()
  }
})

app.engine('.hbs', exphbs({
  defaultLayout: 'redesign',
  extname: '.hbs',
  partialsDir: 'views/components/',
  helpers: {
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

  dataCalls.stories(req)
    .then(stories => {
      res.render('home', {
        year: (new Date()).getFullYear(),
        title: 'Nathan Broslawsky | nathanbroslawsky.com',
        homeStories: stories,
        protocol: req.originalUrl,
        errorFetchingData: false
      })
    })
    .catch(error => {
      res.render('home', {
        year: (new Date()).getFullYear(),
        title: 'Nathan Broslawsky | nathanbroslawsky.com',
        protocol: req.originalUrl,
        errorFetchingData: true
      })
    })

})

app.get('/blog.rss', function(req, res, next) {

  dataCalls.stories()
    .then(stories => {
      const feed = require('./lib/setup-feed')(stories)
      res.set('Content-Type', 'text/xml')
      res.send(feed.rss2())
    })
    .catch(err => {
      res
        .status(503)
        .set('Content-Type', 'text/plain')
        .send("Our RSS feed is temporarily down. Please try again in a few minutes. I'm sure alarm bells are going off somewhere...")
    })
})

app.get('/about', function (req, res, next) {
  res.render('about', {
    year: (new Date()).getFullYear(),
    title: 'Nathan Broslawsky | nathanbroslawsky.com',
    protocol: req.originalUrl
  })
})

app.get('/newsletter', function (req, res, next) {
  res.render('newsletter', {
    year: (new Date()).getFullYear(),
    title: 'Newsletter | nathanbroslawsky.com',
    protocol: req.originalUrl
  })
})

app.get('/blog', function (req, res, next) {

  res.redirect(301, "/")
})

app.get('/blog/:slug', function (req, res, next) {

  Promise.all([
      dataCalls.story(req.params.slug),
      dataCalls.getPrevStory(req.params.slug),
      dataCalls.getNextStory(req.params.slug)
    ])
    .then(([story,prev,next]) => {

      res.render('post', {
        year: (new Date()).getFullYear(),
        title: story.fields.title + ' | Nathan Broslawsky | nathanbroslawsky.com',
        story: story,
        errorFetchingData: false,
        readMore: { prev: prev, next: next },
        params: req.query
      })
    })
    .catch(err => {
      console.error('[Page Load Error]', err)

      var status = err.status || null
      if(status == 404) {
        return next()
      }

      res.render('post', {
        year: (new Date()).getFullYear(),
        title: 'Nathan Broslawsky | nathanbroslawsky.com',
        errorFetchingData: true
      })
    })
})

app.get('/clear_cache', function (req, res, next) {
  dataCalls.clearCache()
  res.send('Cache cleared')
})

app.get('*', function (req, res, next) {
  res.statusCode = 404
  res.render('404', {
    year: (new Date()).getFullYear(),
    title: 'Page Not Found | Nathan Broslawsky | nathanbroslawsky.com'
  })
})

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

app.listen(port, () => console.log(`nathanbroslawsky.com [${process.env.NODE_ENV}] is listening on port ${port}!`))
