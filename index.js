const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()
const port = require('./lib/get-port')()
const marked = require('marked')
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
  console.log(process.env.NODE_ENV, req.headers.host.substring(0, 4))
  if(process.env.NODE_ENV === 'production' && req.headers.host.substring(0, 4) !== 'www.') {
    // res.redirect('https://www.' + req.headers.host + req.url)
    console.log(req.headers.host.substring(4), 'https://www.' + req.headers.host + req.url)
    next()
  } else {
    next()
  }
})

app.engine('.hbs', exphbs({
  defaultLayout: 'redesign',
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

    var errorFetchingData = false
    if (err) {
      errorFetchingData = true
    }

    res.render('home', {
      year: (new Date()).getFullYear(),
      title: 'Nathan Broslawsky | nathanbroslawsky.com',
      homeStories: !errorFetchingData && results.stories,
      protocol: req.originalUrl,
      errorFetchingData: errorFetchingData
    })
  })
})

app.get('/blog.rss', function(req, res, next) {
  async.parallel({
    stories: dataCalls.stories(req)
  }, function (err, results) {
    if (err) {
      return res
        .status(503)
        .set('Content-Type', 'text/plain')
        .send("Our RSS feed is temporarily down. Please try again in a few minutes. I'm sure alarm bells are going off somewhere...")
    }

    const feed = require('./lib/setup-feed')(results)
    res.set('Content-Type', 'text/xml')
    res.send(feed.rss2())
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

  // async.parallel({
  //   stories: dataCalls.stories(req)
  // }, function (err, results) {

  //   var errorFetchingData = false
  //   if (err) {
  //     errorFetchingData = true
  //   }

  //   res.render('masonry', {
  //     year: (new Date()).getFullYear(),
  //     title: 'Blog | Nathan Broslawsky | nathanbroslawsky.com',
  //     stories: results && results.stories,
  //     params: req.query,
  //     errorFetchingData: errorFetchingData
  //   })
  // })
})

app.get('/blog/:slug', function (req, res, next) {
  async.parallel({
    story: dataCalls.story(req),
    links: dataCalls.links(req)
  }, function (err, results) {

    var errorFetchingData = false
    if (err) {
      errorFetchingData = true
    }

    if(errorFetchingData) {
      res.render('post', {
        year: (new Date()).getFullYear(),
        title: 'Nathan Broslawsky | nathanbroslawsky.com',
        errorFetchingData: errorFetchingData
      })
    } else {
      res.render('post', {
        year: (new Date()).getFullYear(),
        title: results.story.name + ' | Nathan Broslawsky | nathanbroslawsky.com',
        story: results.story,
        errorFetchingData: errorFetchingData,
        readMore: {
          prev: dataCalls.getPrevStory(results.story.id, results.links),
          next: dataCalls.getNextStory(results.story.id, results.links),
        },
        params: req.query
      })
    }
  })
})

app.get('/clear_cache', function (req, res, next) {
  dataCalls.clearCache(function(err) {
    res.send('Cache cleared')
  })
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
