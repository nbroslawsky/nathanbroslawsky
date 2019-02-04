const express = require('express')
const path = require('path')
const app = express()
const port = 8080

app.use((req, res, next) => {
	console.log('x-forwarded-proto', req.headers['x-forwarded-proto'])
	if(req.headers['x-forwarded-proto'] == 'http') {
		res.redirect('https://' + req.headers.host + req.url)
	} else {
		next()
	}
})

app.set('view engine', 'pug')
app.use('/files', express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => res.render('index', {
	protocol: req.originalUrl
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))