const express = require('express')
const path = require('path')
const app = express()
const port = 8080

// if we're running in production
if(process.env.NODE_ENV == 'production') {
	app.use((req, res, next) => {
		if(req.headers['x-forwarded-proto'] == 'http') {
			res.redirect('https://' + req.headers.host + req.url)
		} else {
			next()
		}
	})
}

app.set('view engine', 'pug')
app.use('/files', express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => res.render('index', {
	protocol: req.originalUrl
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))