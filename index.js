const express = require('express')
const path = require('path')
const app = express()
const port = 8080

app.set('view engine', 'pug')
app.use('/files', express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => res.render('index'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))