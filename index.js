const express = require('express')
const path = require('path')
const app = express()
const port = 8080

app.use((req, res, next) => {
	console.log('stuff', req.url)
	next()
})
if(process.env.NODE_ENV == 'production') {

}

app.set('view engine', 'pug')
app.use('/files', express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => res.render('index', {
	protocol: req.protocol
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))