const express = require('express')
const app = express()
const config = require('./config.json')
const port = '8080'

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at localhost:${port}`)
})
