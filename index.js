const express = require('express')
const app = express()
const config = require('./config.json')
const port = config.port

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at localhost:${port}`)
})
